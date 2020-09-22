import { IDuplication, IFileToken, IToken } from '../index.d';
import { FileUtil } from './files';
import { filterCombine } from './combine';

export function dupone (astringtokens: string[], bstringtokens: string[]): { [key: string]: number } {

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

function makedup (map: { [key: string]: number }, atokens: IToken[], btokens: IToken[], maxlen: number): IDuplication[] {
  let res: IDuplication[] = [];
  let keys = Object.keys(map);
  let k = keys.length;
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

      let diff = {
        key: `${afilename}_${bfilename}_${astart.pos}_${bstart.pos}`,
        a: {
          filename: afilename,
          start: astart,
          value: acontent.slice(astart.pos, aend.pos),
          end: aend
        },
        b: {
          filename: bfilename,
          start: bstart,
          value: bcontent.slice(bstart.pos, bend.pos),
          end: bend
        }
      };
      res.push(diff);
    }
  }
  return res;
}
function _dup (comb: string[], file: FileUtil, maxlen: number): IDuplication[] {
  let afile: IFileToken;
  let bfile: IFileToken;
  let datas = file.datas;
  afile = datas[comb[0]];
  bfile = datas[comb[1]];
  let map = dupone(afile.stringtokens, bfile.stringtokens);
  return makedup(map, afile.tokens, bfile.tokens, maxlen);
}


async function split (combs: string[][], file: FileUtil, maxlen: number): Promise<IDuplication[]> {
  let comb;
  let res: IDuplication[] = [];
  while (comb = combs.shift()) {
    let t = _dup(comb, file, maxlen);
    Array.prototype.push.apply(res, t);
  }
  return res;
}

function sleep (time: number = 50) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
async function dupeach (combines: string[][], file: FileUtil, maxlen: number): Promise<IDuplication[]> {
  // let allcombs = [...combines];
  // let res: IDuplication[] = [];
  // let actions = [];
  // while (allcombs.length) {
  //   let combs = allcombs.splice(0, 10000);
  //   actions.push((async (combs) => {
  //     let t = await split(combs, file, maxlen);
  //     Array.prototype.push.apply(res, t);
  //   })(combs));
  // }
  // await Promise.all(actions);

  let comb;
  let combs = [...combines];
  let res: IDuplication[] = [];
  let count = 0;
  while (comb = combs.shift()) {
    let t = _dup(comb, file, maxlen);
    Array.prototype.push.apply(res, t);
    count++;
    if (count > 2000) {
      count = 0;
      await sleep();
    }
  }
  return res;
}
export async function dup (filename: string, file: FileUtil, maxlen: number): Promise<IDuplication[]> {
  let combs = filterCombine(file.combines, filename);
  return await dupeach(combs, file, maxlen);
}

export async function dupall (file: FileUtil, maxlen: number): Promise<IDuplication[]> {
  let combs = file.combines;
  return await dupeach(combs, file, maxlen);
}