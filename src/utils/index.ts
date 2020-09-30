import * as fs from 'fs';
import * as pify from 'pify';
import * as chokidar from 'chokidar';
import { Config } from './config';
import { IFile, IDuplicationToken } from '../index.d';
import * as path from 'path';
import {
  performance
} from 'perf_hooks';

export function removeRoot (p: string, root: string | undefined): string {
  if (root === undefined) {
    return p;
  }
  return p.replace(new RegExp(`^${root}/`, 'i'), '');
}

export function getFileExt (filename: string): string | undefined {
  let ext = path.extname(filename).replace(/\.(.*)/, '$1');
  return ext ? ext : undefined;
}

export async function read (filepath: string): Promise<(IFile & { stats: fs.Stats }) | undefined> {
  try {
    let [stats, content] = await Promise.all([
      pify(fs.stat)(filepath),
      pify(fs.readFile)(filepath, 'utf-8')
    ]);
    return {
      filepath,
      content,
      stats
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

// 暂时不使用, 采用动态规划 计算相同代码
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
