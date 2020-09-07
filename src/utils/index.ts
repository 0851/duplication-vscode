import * as fs from 'fs';
import * as pify from 'pify';
import * as chokidar from 'chokidar';
import { Config } from './config';
import { getFormatByFile } from '@jscpd/tokenizer';

export interface File {
  filepath: string
  content: string
  format: string
  stats: fs.Stats
}
export async function read (filepath: string, config: Config): Promise<File | undefined> {
  try {
    let [stats, content] = await Promise.all([
      pify(fs.stat)(filepath),
      pify(fs.readFile)(filepath, 'utf-8')
    ]);
    const format: string | undefined = getFormatByFile(filepath, config.formatsExts);
    if (format === undefined) {
      return undefined;
    }
    return {
      filepath,
      content,
      format,
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

export function debounce<Params extends any[]> (fn: (...args: Params) => any, n?: number, immed?: boolean): (...args: Params) => any {
  let timer: NodeJS.Timer | undefined = undefined;
  return function (this: any, ...args: Params) {
    if (timer === undefined && immed === true) {
      fn.apply(this, args);
    }
    timer && clearTimeout(timer);
    n = n || 100;
    timer = setTimeout(() => fn.apply(this, args), n);
    return timer;
  };
};