
// from http://jimyuan.github.io/blog/2019/04/03/combination-algorithm-with-js.html
// 改良
// 文件名分组 所有组合
/**
 * 获得指定数组的所有组合
 */
export function arrayCombine (targetArr: string[] = [], count = 1): string[][] {
  if (!Array.isArray(targetArr)) { return []; };

  const resultArrs = [];
  // 所有组合的 01 排列
  const flagArrs = getFlagArrs(targetArr.length, count);
  while (flagArrs.length) {
    const flag = flagArrs.shift();
    if (!flag) {
      continue;
    }
    let reg = /1/g;
    let match: RegExpExecArray | null;
    let res = [];
    while (match = reg.exec(flag), match !== null) {
      res.push(targetArr[match.index]);
    };
    resultArrs.push(res);
  }
  return resultArrs;
}

// console.log(arrayCombine(['爱上邓丽君', '萨顶顶', '得到的', '对的'], 3));
// console.log(arrayCombine(['爱上邓丽君', '萨顶顶', '得到的', '对的'], 2));
// console.log(arrayCombine(['爱上邓丽君', '萨顶顶', '得到的', '对的'], 1));
/**
 * 获得从 m 中取 n 的所有组合
 * 思路如下：
 * 生成一个长度为 m 的数组，
 * 数组元素的值为 1 表示其下标代表的数被选中，为 0 则没选中。
 *
 * 1. 初始化数组，前 n 个元素置 1，表示第一个组合为前 n 个数；
 * 2. 从左到右扫描数组元素值的 “10” 组合，找到第一个 “10” 组合后将其变为 “01” 组合；
 * 3. 将其左边的所有 “1” 全部移动到数组的最左端
 * 4. 当 n 个 “1” 全部移动到最右端时（没有 “10” 组合了），得到了最后一个组合。
 */
export function getFlagArrs (m: number, n: number = 1): string[] {
  if (n < 1 || m < n) { return []; };

  // 先生成一个长度为 m 字符串，开头为 n 个 1， 例如“11100”
  let str = '1'.repeat(n) + '0'.repeat(m - n);
  // 1
  const resultArrs = [str];
  const reg = /10/;

  while (reg.test(str)) {
    str = str.replace(reg, '01');
    resultArrs.push(str);
  }
  return resultArrs;
}

// 获取指定文件的所有组合
export function filterByPath (groups: string[][], filepath: string): string[][] {
  let res = [];
  for (let index = 0; index < groups.length; index++) {
    const element = groups[index];
    if (element[0] === filepath) {
      let [e, b] = element;
      res.push([e, b]);
    }
    else if (element[1] === filepath) {
      let [e, b] = element;
      res.push([b, e]);
    }
  }
  return res;
}
