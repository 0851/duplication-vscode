import { IFileData, IDuplication } from '../index.d';
export function dupo (afilename: string, bfilename: string, datas: IFileData, maxlen: number = 50): IDuplication[] {
  let afile = datas[afilename];
  let bfile = datas[bfilename];
  if (!afile || !bfile) {
    return [];
  }
  let atokens = afile.tokens || [];
  let btokens = bfile.tokens || [];
  let m = atokens.length;
  let n = btokens.length;
  let res: IDuplication[] = [];

  // let arr: number[][] = [];
  // for (let i = 0; i < m + 1; i++) {
  //   for (let j = 0; j < n + 1; j++) {
  //     arr[i] = arr[i] || [];
  //     // 第一行第一列 置0
  //     if (i === 0 || j === 0) {
  //       arr[i][j] = 0;
  //     } else if (
  //       atokens[i - 1].filename === btokens[j - 1].filename
  //       && atokens[i - 1].start.pos === btokens[j - 1].start.pos
  //     ) {
  //       //过滤掉相同文件的相同位置, 取不同位置
  //       arr[i][j] = 0;
  //     } else if (atokens[i] && btokens[j]
  //       && atokens[i - 1] && btokens[j - 1]
  //       && atokens[i].value === btokens[j].value
  //       && atokens[i - 1].value === btokens[j - 1].value) {
  //       arr[i][j] = arr[i - 1][j - 1] + 1;
  //       arr[i - 1][j - 1] = 0;
  //     } else {
  //       arr[i][j] = 0;
  //     }
  //   }
  // }


  // for (let i = 0; i < m + 1; i++) {
  //   for (let j = 0; j < n + 1; j++) {
  //     if (arr[i][j] >= maxlen) {
  //       let end = arr[i][j];
  //       let aendtoken = atokens[i];
  //       let bendtoken = btokens[j];
  //       let astarttoken = atokens[i - end];
  //       let bstarttoken = btokens[j - end];
  //       let diff = {
  //         a: {
  //           filename: aendtoken.filename,
  //           start: astarttoken.start,
  //           value: afile.content.slice(astarttoken.start.pos, aendtoken.end.pos),
  //           end: aendtoken.end
  //         },
  //         b: {
  //           filename: bendtoken.filename,
  //           start: bstarttoken.start,
  //           value: bfile.content.slice(bstarttoken.start.pos, bendtoken.end.pos),
  //           end: bendtoken.end
  //         }
  //       };
  //       res.push(diff);
  //     }
  //   }
  // }

  return res;
}
export function dup (combine: string[][], datas: IFileData, maxlen: number = 50): IDuplication[] {
  let res: IDuplication[] = [];
  for (let index = 0; index < combine.length; index++) {
    const element = combine[index];
    let items = dupo(element[0], element[1], datas, maxlen);
    if (items.length) {
      Array.prototype.push.apply(res, items);
    }
  }
  return res;
}