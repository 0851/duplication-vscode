
import { read, watch, File, WatchEventName, hasOwnProperty } from '.';
import * as fs from 'fs';
import * as globby from 'globby';
import * as bytes from 'bytes';
import { Config } from './config';
import * as eventemitter3 from 'eventemitter3';
import debounce from 'lodash-es/debounce';
import { IToken } from './tokenizer';
export interface FileData {
  [filepath: string]: File
}
export interface FileHash {
  [filepath: string]: number
}
export interface IClone {
  a: IToken
  b: IToken
}

export class Files extends eventemitter3 {
  datas: FileData;
  watch: (() => Promise<void>) | undefined;
  hashs: FileHash;
  constructor (public config: Config) {
    super();
    this.datas = {};
    this.hashs = {};
    this.config = config;
  }
  async exec (): Promise<void> {
    if (!this.config.root) {
      return;
    }
    if (this.watch) {
      await this.watch();
    }
    let paths = await globby(`${this.config.root}/**/*`, {
      dot: true,
      cwd: this.config.root,
      ignore: this.config.ignore.map((i) => `${this.config.root}/${i}`),
      absolute: true,
      onlyFiles: true,
      unique: true,
      braceExpansion: true,
      caseSensitiveMatch: false,
      gitignore: true,
      expandDirectories: true
    });
    if (this.config.watch === true) {
      this.watch = watch(`${this.config.root}/**/*`, debounce(this.update.bind(this)), this.config);
    }
    await this.reads(paths);
  }
  //计算汉明距离
  hammingDistance (num1: number, num2: number): number {
    return ((num1 ^ num2).toString(2).match(/1/g) || '').length;
  };
  async reads (filepaths: string[]): Promise<void> {
    console.time('reads');
    await Promise.all(filepaths.map((filepath) => this.read(filepath)));
    console.timeEnd('reads');
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
  async put (filepath: string, obj: Partial<File>) {
    let file = this.get(filepath);
    if (!file) {
      return;
    }
    let nf: File = {
      ...file,
      ...obj
    };
    if (file) {
      this.save(filepath, nf);
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
  async clones (): Promise<IClone[]> {
    return [];
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
    return this.save(filepath, f);
  }
}