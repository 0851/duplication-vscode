
import { read, watch, File, WatchEventName, hasOwnProperty } from '.';
import * as fs from 'fs';
import * as globby from 'globby';
import * as bytes from 'bytes';
import { Config } from './config';
import * as eventemitter3 from 'eventemitter3';
import { debounce } from '../utils';
export interface FileData {
  [filepath: string]: File
}

export class Files extends eventemitter3 {
  datas: FileData;
  watch: (() => Promise<void>) | undefined;
  constructor (public config: Config) {
    super();
    this.datas = {};
    this.config = config;
  }
  async exec (): Promise<FileData> {
    if (!this.config.root) {
      return {};
    }
    if (this.watch) {
      await this.watch();
    }
    let paths = await globby(`${this.config.root}/**/*`, {
      dot: true,
      cwd: this.config.root,
      ignore: this.config.ignore.map((i) => `${this.config.root}/${i}`),
      // ignore: this.ingore,
      absolute: true,
      onlyFiles: true,
      unique: true,
      braceExpansion: true,
      caseSensitiveMatch: false,
      gitignore: true,
      expandDirectories: true
    });
    this.watch = watch(`${this.config.root}/**/*`, debounce(this.update), this.config);
    return await this.reads(paths);
  }
  async reads (filepaths: string[]): Promise<FileData> {
    await Promise.all(filepaths.map((filepath) => this.read(filepath)));
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
  get (filepath: string): File | undefined {
    return this.datas[filepath];
  }
  put (filepath: string, obj: Partial<File>) {
    let file = this.get(filepath);
    if (file) {
      this.save(filepath, {
        ...file,
        ...obj
      });
    }
  }
  clear (): void {
    Object.keys(this.datas).map((key) => {
      return this.remove(key);
    });
  }
  save (filepath: string, item: File): File {
    this.datas[filepath] = item;
    return item;
  }
  remove (filepath: string): void {
    let item = this.datas[filepath];
    if (!item) {
      return;
    }
    delete this.datas[filepath];
  }
  async update (rootpath: string, event: WatchEventName, filepath: string, stats?: fs.Stats): Promise<void> {
    if (event === 'unlink' || event === 'error') {
      this.remove(filepath);
    }
    await this._read(filepath);
    this.emit('update');
  }
  async read (key: string): Promise<File | undefined> {
    if (this.datas[key]) {
      return this.datas[key];
    }
    return await this._read(key);
  }
  skipBigFiles (entry: File): boolean {
    const { stats, filepath } = entry;
    const shouldSkip = bytes.parse(stats.size) > bytes.parse(this.config.maxSize);
    if (this.config.debug && shouldSkip) {
      console.log(`File ${filepath} skipped! Size more then limit (${bytes(stats.size)} > ${this.config.maxSize})`);
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
  async _read (filepath: string): Promise<File | undefined> {
    let f = await read(filepath, this.config);
    if (f === undefined) {
      return;
    }
    if (this.skip(f) === true) {
      return;
    }
    let item: File = {
      filepath: filepath,
      content: f.content,
      format: f.format,
      stats: f.stats
    };
    return this.save(filepath, item);
  }
}