import { IDuplication, IFileToken, IToken } from '../index.d';
import { FileUtil } from './files';
import { filterCombine } from './combine';
import { Config } from './config';

export function dupOne (astringtokens: string[], bstringtokens: string[]): { [key: string]: number } {

  let m = astringtokens.length;
  let n = bstringtokens.length;
  let map: { [key: string]: number } = {};
  let at;
  let bt;
  let ata;
  let bta;

  for (let j = 0; j < n + 1; j++) {
    for (let i = 0; i < m + 1; i++) {
      at = astringtokens[i];
      ata = astringtokens[i + 1];
      bt = bstringtokens[j];
      bta = bstringtokens[j + 1];
      if (at && bt && ata && bta && at === bt && ata === bta) {
        let n = `${i}_${j}`;
        let pre = map[n] || 0;
        map[`${i + 1}_${j + 1}`] = pre + 1;
        if (pre > 0) {
          delete map[n];
        }
      }
    }
  }
  return map;
}

function maked (map: { [key: string]: number }, atokens: IToken[], btokens: IToken[], maxlen: number, minLine: number): IDuplication[] {
  let res: IDuplication[] = [];
  let keys = Object.keys(map);
  let k = keys.length;
  let resmap: { [key: string]: boolean } = {};
  for (let index = 0; index < k; index++) {
    const key = keys[index];
    let end = map[key];
    if (end >= maxlen) {
      let ek = key.split('_');
      let i = parseInt(ek[0]);
      let j = parseInt(ek[1]);

      let astarttoken = atokens[i - end];
      let bstarttoken = btokens[j - end];
      let aendtoken = atokens[i];
      let bendtoken = btokens[j];

      if (!aendtoken || !bstarttoken || !aendtoken || !bendtoken) {
        continue;
      }
      if (astarttoken.filename !== aendtoken.filename || bstarttoken.filename !== bendtoken.filename) {
        continue;
      }

      if (astarttoken.filename === bstarttoken.filename && astarttoken.start.pos === bstarttoken.start.pos) {
        continue;
      }

      let afilename = aendtoken.filename;
      let acontent = aendtoken.content;
      let astart = astarttoken.start;
      let aend = aendtoken.end;

      let bfilename = bendtoken.filename;
      let bcontent = bendtoken.content;
      let bstart = bstarttoken.start;
      let bend = bendtoken.end;

      let mapkey = `${afilename}_${bfilename}_${astart.pos}_${bstart.pos}_${aend.pos}_${bend.pos}`;

      if (resmap[mapkey] === true) {
        continue;
      }

      if ((bend.line - bstart.line) < minLine && (aend.line - astart.line) < minLine) {
        continue;
      }

      resmap[mapkey] = true;

      let diff = {
        key: mapkey,
        a: {
          filename: afilename,
          start: astart,
          end: aend
        },
        b: {
          filename: bfilename,
          start: bstart,
          end: bend
        }
      };
      res.push(diff);
    }
  }
  return res;
}





function sleep (time: number = 100) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}


// async function split (combs: string[][], file: FileUtil, config: Config): Promise<IDuplication[]> {
//   let comb;
//   let res: IDuplication[] = [];
//   while (comb = combs.shift()) {
//     let t = _dup(comb, file, config);
//     Array.prototype.push.apply(res, t);
//   }
//   return res;
// }
// function _dup (comb: string[], file: FileUtil, config: Config): IDuplication[] {
//   let afile: IFileToken;
//   let bfile: IFileToken;
//   let datas = file.datas;
//   afile = datas[comb[0]];
//   bfile = datas[comb[1]];
//   if (!afile || !bfile) {
//     return [];
//   }
//   let map = dupOne(afile.stringtokens, bfile.stringtokens);
//   return maked(map, afile.tokens, bfile.tokens, config.minTokens, config.minLine);
// }
// async function dupEach (combines: string[][], file: FileUtil, config: Config): Promise<IDuplication[]> {

//   // let allcombs = [...combines];
//   // let res: IDuplication[] = [];
//   // let actions = [];
//   // while (alliums.length) {
//   //   let combs = allcombs.splice(0, 10000);
//   //   actions.push((async (combs) => {
//   //     let t = await split(combs, file, maxlen);
//   //     Array.prototype.push.apply(res, t);
//   //   })(combs));
//   // }
//   // await Promise.all(actions);

//   let comb;
//   let combs = [...combines];
//   let res: IDuplication[] = [];
//   let count = 0;
//   while (comb = combs.shift()) {
//     let t = _dup(comb, file, config);
//     Array.prototype.push.apply(res, t);
//     count++;
//     if (count > 2000) {
//       count = 0;
//       await sleep(100);
//     }
//   }
//   return res;
// }
// export async function dup (filename: string, file: FileUtil, config: Config): Promise<IDuplication[]> {
//   let combs = filterCombine(file.combines, filename);
//   return await dupEach(combs, file, config);
// }
// export async function dupAll (file: FileUtil, config: Config): Promise<IDuplication[]> {
//   let combs = file.combines;
//   config.debug === true && console.time('dupAll');
//   let res = await dupEach(combs, file, config);
//   config.debug === true && console.timeEnd('dupAll');
//   return res;
// }

export class Dup {
  stoped: boolean = false;
  constructor (public file: FileUtil, public config: Config, public filename?: string) { }
  async run (): Promise<IDuplication[]> {
    let combs = this.file.combines;
    if (this.filename) {
      combs = filterCombine(combs, this.filename);
    }
    this.stoped = false;
    this.config.debug === true && console.time('Dup');
    let res = await this.each(combs, this.file, this.config);
    this.config.debug === true && console.timeEnd('Dup');
    return res;
  }
  stop () {
    this.stoped = true;
  }
  async each (combines: string[][], file: FileUtil, config: Config): Promise<IDuplication[]> {
    let comb;
    let combs = [...combines];
    let res: IDuplication[] = [];
    let count = 0;
    // let actions = [];
    while (comb = combs.shift()) {
      // actions.push(this.dup(comb, file, config));
      if (this.stoped === true) {
        return [];
      }
      let ires = this.dup(comb, file, config);
      Array.prototype.push.apply(res, ires);
      count++;
      if (count > 500) {
        count = 0;
        await sleep(50);
      }
    }
    return res;
    // let responses = await Promise.all(actions);
    // return responses.reduce((res, ires) => {
    //   Array.prototype.push.apply(res, ires);
    //   return res;
    // }, []);
  }
  dup (comb: string[], file: FileUtil, config: Config): IDuplication[] {
    try {
      let afile: IFileToken;
      let bfile: IFileToken;
      let datas = file.datas;
      afile = datas[comb[0]];
      bfile = datas[comb[1]];
      if (!afile || !bfile) {
        return [];
      }
      let map = dupOne(afile.stringtokens, bfile.stringtokens);
      let res = maked(map, afile.tokens, bfile.tokens, config.minTokens, config.minLine);
      return res;
    } catch (error) {
      return [];
    }
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //   }, 0);
    // });
  }
}