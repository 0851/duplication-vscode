
import { read, watch, WatchEventName, hasOwnProperty } from '.';
import * as fs from 'fs';
import * as path from 'path';
//fast glob TODO download
import * as globby from 'globby';
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
  root: string;
  constructor (root: string, ingore: string[]) {
    this.datas = {};
    this.root = root;
    this.ingore = ingore;
  }
  async exec (): Promise<FileData> {
    let paths = await globby(`${this.root}/**/*`, {
      dot: true,
      cwd: this.root,
      ignore: this.ingore.map((i) => `${this.root}/${i}`),
      // ignore: this.ingore,
      absolute: true,
      onlyFiles: true,
      unique: true,
      braceExpansion: true,
      caseSensitiveMatch: false,
      gitignore: true,
      expandDirectories: true
    });
    return await this.reads(paths);
  }
  async reads (filepaths: string[]): Promise<FileData> {
    await Promise.all(filepaths.map(async (filepath) => {
      await this.read(filepath);
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
    if (event === 'unlink' || event === 'error') {
      this.remove(filepath);
    }
    await this._read(filepath);
  }
  async read (key: string): Promise<FileItem | undefined> {
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
    this.datas[filepath] = item;
    return item;
  }
  async _read (filepath: string): Promise<FileItem | undefined> {
    let str: string | undefined = undefined;
    str = await read(filepath);
    if (str === undefined) {
      return;
    }
    let s: string = str;
    let item: FileItem = {
      filepath: filepath,
      source: s,
      watched: watch(filepath, (filepath: string, eventName: WatchEventName, path: string, stats?: fs.Stats) => {
        this.update(filepath, eventName, path, stats);
      })
    };
    return this.setItem(filepath, item);
  }
}