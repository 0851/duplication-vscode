import * as fs from 'fs';
import * as pify from 'pify';
import * as chokidar from 'chokidar';
import { Config } from './config';
import { Tokenizer, IToken, IShingles } from './tokenizer';
import {
  performance,
  PerformanceObserver
} from 'perf_hooks';
export interface File {
  filepath: string
  content: string
  stats: fs.Stats
  tokens: IToken[],
  shingles: IShingles
}
export async function read (filepath: string, config: Config): Promise<File | undefined> {
  try {
    let [stats, content] = await Promise.all([
      pify(fs.stat)(filepath),
      pify(fs.readFile)(filepath, 'utf-8')
    ]);
    const tokenizer = new Tokenizer(content, filepath);
    tokenizer.exec();
    return {
      filepath,
      content,
      tokens: tokenizer.tokens,
      shingles: tokenizer.shingles,
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