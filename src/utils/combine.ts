
export function arrayCombine (targetArr: string[] = [], m = 2): string[][] {
  console.time('arrayCombine');
  let combine: string[][] = [];
  let n = targetArr.length;
  if (m > n) { return combine; }

  for (let i = 0; i < n; i++) {
    combine.push(Array(m).fill(targetArr[i]));
  }

  let stack = [];
  let first = [];

  for (let i = 0; i < m; i++) {
    stack[i] = i;
    first[i] = targetArr[i];
  }
  combine.push(first);

  let last = [];
  let end = n - m;
  for (let i = 0; i < m; i++) {
    last[i] = end + i;
  }

  let pos = m - 1;
  let lastm = m - 1;
  let temp;

  while (true) {
    if (stack[pos] < last[pos]) {
      stack[pos]++;
      temp = stack[pos];
      pos++;
      if (pos <= lastm) {
        stack[pos] = temp;
      }
    } else {
      pos--;
      if (pos < 0) {
        break;
      }
    }

    if (pos > lastm) {
      let tmp = [];
      for (let i = 0; i < m; i++) {
        tmp[i] = targetArr[stack[i]];
      }
      combine.push(tmp);
      pos = lastm;
    }
  }
  console.timeEnd('arrayCombine');
  return combine;
}

// console.log(arrayCombine(['爱上邓丽君', '萨顶顶', '得到的', '对的'], 3));
// console.log(arrayCombine(['a', 'b', 'c', 'd', 'e'], 2));
// console.log(arrayCombine(['爱上邓丽君', '萨顶顶', '得到的', '对的'], 1));

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
