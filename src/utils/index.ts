import * as fs from 'fs';
import * as pify from 'pify';
import * as chokidar from 'chokidar';
import { Config } from './config';
import { IFile, IShingles } from '../index.d';
import { Tokenizer } from './tokenizer';
import {
  performance,
  PerformanceObserver
} from 'perf_hooks';

export async function read (filepath: string, config: Config): Promise<(IFile & { stats: fs.Stats }) | undefined> {
  try {
    let [stats, content] = await Promise.all([
      pify(fs.stat)(filepath),
      pify(fs.readFile)(filepath, 'utf-8')
    ]);
    let tokenizer = new Tokenizer(content, filepath, config.minTokens);
    tokenizer.exec();
    return {
      filepath,
      content,
      stats,
      tokens: tokenizer.tokens
    };
  } catch (error) {
    return undefined;
  }
}
export type WatchEventName = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir' | 'error';
export type WatchUpdate = (filepath: string, eventName: WatchEventName, path: string, stats?: fs.Stats) => Promise<void> | void;
export function watch (filepath: string, update: WatchUpdate, config: Config) {
  let watched = chokidar.watch(filepath, {
    ignoreInitial: true,
    followSymlinks: true,
    ignored: config.ignore
  }).on('all', (eventName: WatchEventName, path: string, stats?: fs.Stats) => {
    update(filepath, eventName, path, stats);
  });
  return (): Promise<void> => {
    return watched.close();
  };
}

export function hasOwnProperty (o: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(o, key);
}


/**
 * 异步执行统计耗时
 * @param fn 需要手动使用bind 修复this指向
 */
export function execAsync<T extends (...args: any[]) => Promise<any>> (fn: (...args: Parameters<T>) => ReturnType<T>): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    let time = performance.now();
    let res;
    try {
      res = await fn(...args);
    } catch (error) {
      throw error;
    } finally {
      console.log(`${fn.name} async time: ${performance.now() - time}ms`);
    }
    return res;
  };
}
/**
 * 执行统计耗时
 * @param fn 需要手动使用bind 修复this指向
 */
export function exec<T extends (...args: any[]) => any> (fn: (...args: Parameters<T>) => ReturnType<T>): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    let time = performance.now();
    let res;
    try {
      res = fn(...args);
    } catch (error) {
      throw error;
    } finally {
      console.log(`${fn.name} time: ${performance.now() - time}ms`);
    }
    return res;
  };
}


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
  return [];
}

function murmurhash3 (key: string, seed: number) {
  let remainder: number = key.length & 3; // key.length % 4
  let bytes: number = key.length - remainder;
  let h1: number = seed;
  let c1: number = 0xcc9e2d51;
  let c2: number = 0x1b873593;
  let i: number = 0;
  let k1: number;
  let h1b: number;

  while (i < bytes) {
    k1 =
      ((key.charCodeAt(i) & 0xff)) |
      ((key.charCodeAt(++i) & 0xff) << 8) |
      ((key.charCodeAt(++i) & 0xff) << 16) |
      ((key.charCodeAt(++i) & 0xff) << 24);
    ++i;

    k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
    h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
  }

  k1 = 0;

  switch (remainder) {
    case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
    case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
    case 1: k1 ^= (key.charCodeAt(i) & 0xff);

      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= k1;
  }

  h1 ^= key.length;

  h1 ^= h1 >>> 16;
  h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= h1 >>> 13;
  h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}
