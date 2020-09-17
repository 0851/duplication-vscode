import { read, watch, WatchEventName, hasOwnProperty } from './index';
import * as fs from 'fs';
import * as globby from 'globby';
import * as bytes from 'bytes';
import { Config } from './config';
import * as eventemitter3 from 'eventemitter3';
import debounce from 'lodash-es/debounce';
import { Tokenizer } from './tokenizer';
import { IFile, IFileData, IShingles, IPathGroup } from '../index.d';



export class Files extends eventemitter3 {
  datas: IFileData;
  watch: (() => Promise<void>) | undefined;
  _paths: Set<string> = new Set();
  paths: string[] = [];
  groups: IPathGroup = {};
  shingles: IShingles = {};
  constructor (public config: Config) {
    super();
    this.datas = {};
    this.config = config;
  }
  async exec (): Promise<void> {
    if (!this.config.root) {
      return;
    }
    if (this.watch) {
      await this.watch();
    }
    console.time('globby');
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
      this.watch = watch(`${this.config.root}/**/*`, debounce(this.update.bind(this), this.config.debounceWait), this.config);
    }
    console.timeEnd('globby');
    await this.reads(paths);
  }
  //计算汉明距离
  hammingDistance (num1: number, num2: number): number {
    return ((num1 ^ num2).toString(2).match(/1/g) || '').length;
  };
  async reads (filepaths: string[]): Promise<void> {
    console.time('reads');
    await Promise.all(filepaths.map((filepath) => this._read(filepath, false)));
    console.timeEnd('reads');
    this.pathGroupGenerator();
  }
  removes (filepaths: string[]): void {
    filepaths.map((filepath) => {
      return this._remove(filepath, false);
    });
    this.pathGroupGenerator();
  }
  has (filepath: string): boolean {
    return hasOwnProperty(this.datas, filepath);
  }
  get (filepath: string): IFile | undefined {
    return this.datas[filepath];
  }
  async put (filepath: string, obj: Partial<IFile>) {
    let file = this.get(filepath);
    if (!file) {
      return;
    }
    let nf: IFile = {
      ...file,
      ...obj
    };
    let tokenizer = new Tokenizer(nf.content, filepath);
    tokenizer.exec();
    if (file) {
      let item = {
        ...nf,
        tokens: tokenizer.tokens
      };
      this.datas[filepath] = item;
    }
  }
  clear (): void {
    Object.keys(this.datas).map((key) => {
      return this._remove(key, false);
    });
    this.pathGroupGenerator();
  }
  pathGroupGenerator () {
    console.time('pathGroupGenerator');
    let paths = [...this._paths];
    let groups: IPathGroup = {};
    for (let index = 0; index < paths.length; index++) {
      const element = paths[index];
      groups[element] = paths.map((d) => [element, d]);
    }
    this.paths = paths;
    this.groups = groups;
    console.timeEnd('pathGroupGenerator');
  }
  remove (filepath: string): void {
    this._remove(filepath);
  }
  _remove (filepath: string, m: boolean = true) {
    let item = this.datas[filepath];
    if (!item) {
      return;
    }
    delete this.datas[filepath];
    this._paths.delete(filepath);
    if (m === true) {
      this.pathGroupGenerator();
    }
  }
  async update (rootpath: string, event: WatchEventName, filepath: string, stats?: fs.Stats): Promise<void> {
    if (event === 'unlink' || event === 'error') {
      this._remove(filepath, false);
    }
    await this._read(filepath, false);
    this.pathGroupGenerator();
    this.emit('update');
  }
  async read (key: string): Promise<IFile | undefined> {
    return await this._read(key);
  }
  skipBigFiles (entry: IFile & { stats: fs.Stats }): boolean {
    const { stats, filepath } = entry;
    const shouldSkip = bytes.parse(stats.size) > bytes.parse(this.config.maxSize);
    if (this.config.debug && shouldSkip) {
      console.log(`File ${filepath} skipped! Size more then limit (${bytes(stats.size)} > ${this.config.maxSize})`);
    }
    return shouldSkip;
  }
  skip (f: IFile & { stats: fs.Stats }) {
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
  async _read (filepath: string, m: boolean = true): Promise<IFile | undefined> {
    if (this.datas[filepath]) {
      return this.datas[filepath];
    }
    let f = await read(filepath);
    if (f === undefined) {
      return;
    }
    if (this.skip(f) === true) {
      return;
    }
    this._paths.add(filepath);
    let tokenizer = new Tokenizer(f.content, filepath);
    tokenizer.exec();
    let item = {
      filepath: f.filepath,
      content: f.content,
      tokens: tokenizer.tokens
    };
    this.datas[filepath] = item;
    if (m === true) {
      this.pathGroupGenerator();
    }
    return item;
  }
}