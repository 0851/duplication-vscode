
import { read, watch, File, WatchEventName, hasOwnProperty } from '.';
import * as fs from 'fs';
import * as globby from 'globby';
import * as bytes from 'bytes';
import { Config } from './config';
export interface FileItem {
  filepath: string,
  source: string,
  format: string,
  stats: fs.Stats,
  watched: () => Promise<void>
}

export interface FileData {
  [filepath: string]: FileItem
}

export class Files {
  datas: FileData;
  constructor (public root: string, public config: Config) {
    this.datas = {};
    this.root = root;
    this.config = config;
  }
  async exec (): Promise<FileData> {
    let paths = await globby(`${this.root}/**/*`, {
      dot: true,
      cwd: this.root,
      ignore: this.config.ignore.map((i) => `${this.root}/${i}`),
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
  skipBigFiles (entry: File): boolean {
    const { stats, path } = entry;
    const shouldSkip = bytes.parse(stats.size) > bytes.parse(this.config.maxSize);
    if (this.config.debug && shouldSkip) {
      console.log(`File ${path} skipped! Size more then limit (${bytes(stats.size)} > ${this.config.maxSize})`);
    }
    return shouldSkip;
  }
  skip (f: File) {
    if (f.content === '') {
      return true;
    }
    if (f.stats.isFile() !== true) {
      return true;
    }
    if (this.skipBigFiles(f) === true) {
      return true;
    }
    return false;
  }
  async _read (filepath: string): Promise<FileItem | undefined> {
    let f = await read(filepath, this.config);
    if (f === undefined) {
      return;
    }
    if (this.skip(f) === true) {
      return;
    }
    let item: FileItem = {
      filepath: filepath,
      source: f.content,
      format: f.format,
      stats: f.stats,
      watched: watch(filepath, (filepath: string, eventName: WatchEventName, path: string, stats?: fs.Stats) => {
        this.update(filepath, eventName, path, stats);
      })
    };
    return this.setItem(filepath, item);
  }
}