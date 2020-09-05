
import { read, watch, WatchEventName, hasOwnProperty } from '.';
import * as fs from 'fs';
//fast glob TODO download
// import globs from 'glob-fs';
export interface FileItem {
  filepath: string,
  source: string,
  watched: () => Promise<void>
}
export interface FileData {
  [filepath: string]: FileItem
}

export class Files {
  datas: FileData;
  ingore: string[];
  constructor (root: string, ingore: string[]) {
    this.datas = {};
    this.ingore = ingore;
  }
  async reads (filepaths: string[]): Promise<FileData> {
    await Promise.all(filepaths.map((filepath) => {
      return this.read(filepath);
    }));
    return this.datas;
  }
  removes (filepaths: string[]): void {
    filepaths.map((filepath) => {
      return this.remove(filepath);
    });
  }
  has (filepath: string): boolean {
    return hasOwnProperty(this.datas, filepath);
  }
  clear (): void {
    Object.keys(this.datas).map((key) => {
      return this.remove(key);
    });
  }
  remove (filepath: string): void {
    this.removeItem(filepath);
  }
  async update (filepath: string, event: WatchEventName, path: string, stats?: fs.Stats): Promise<void> {
    this.remove(filepath);
    await this._read(filepath);
  }
  async read (key: string): Promise<FileItem> {
    if (this.datas[key]) {
      return this.datas[key];
    }
    return await this._read(key);
  }
  removeItem (filepath: string): void {
    let item = this.datas[filepath];
    if (!item) {
      return;
    }
    // close watch
    item.watched();
    // delete key
    delete this.datas[filepath];
  }

  setItem (filepath: string, item: FileItem): FileItem {
    this.remove(filepath);
    this.datas[filepath] = item;
    return item;
  }
  async _read (filepath: string): Promise<FileItem> {
    let str: string | undefined = undefined;
    str = await read(filepath);
    let s: string = str === undefined ? '' : str;
    let item: FileItem = {
      filepath: filepath,
      source: s,
      watched: watch(filepath, this.update)
    };
    return this.setItem(filepath, item);
  }
}