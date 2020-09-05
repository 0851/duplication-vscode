import * as fs from 'fs';
import * as pify from 'pify';
import * as chokidar from 'chokidar';


export async function read (filepath: string): Promise<string | undefined> {
  try {
    return await pify(fs.readFile)(filepath, 'utf-8');
  } catch (error) {
    return undefined;
  }
}
export type WatchEventName = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir';
export type WatchUpdate = (filepath: string, eventName: WatchEventName, path: string, stats?: fs.Stats) => Promise<void> | void;
export function watch (filepath: string, update: WatchUpdate) {
  let watched = chokidar.watch(filepath).on('all', (eventName: WatchEventName, path: string, stats?: fs.Stats) => {
    update(filepath, eventName, path, stats);
  });
  return (): Promise<void> => {
    return watched.close();
  };
}

export function hasOwnProperty (o: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(o, key);
}
