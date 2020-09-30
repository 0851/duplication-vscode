import { read, hasOwnProperty, getFileExt } from './index';
import * as fs from 'fs';
import * as globby from 'globby';
import * as bytes from 'bytes';
import { Config } from './config';
import * as eventemitter3 from 'eventemitter3';
import { Tokenizer } from './tokenizer';
import { IFile, IFileData, IShingles, IToken } from '../index.d';
import { arrayCombine } from '../utils/combine';
import { FileChangeType } from 'vscode-languageserver';
import { getexts } from './formats';


export class FileUtil extends eventemitter3 {
  datas: IFileData;
  _paths: Set<string> = new Set();
  paths: string[] = [];
  tokens: IToken[] = [];
  shingles: IShingles = {};
  combines: string[][] = [];
  constructor (public config: Config) {
    super();
    this.datas = {};
    this.config = config;
  }
  async getpaths () {
    if (!this.config.root) {
      return [];
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
    console.timeEnd('globby');
    return paths;
  }
  async exec (): Promise<void> {
    let paths = await this.getpaths();
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
        tokens: tokenizer.tokens,
        stringtokens: tokenizer.stringtokens
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
    let tokens: IToken[] = paths.reduce((res, p) => {
      Array.prototype.push.apply(res, this.datas[p].tokens);
      return res;
    }, []);
    paths.sort();
    this.paths = paths;
    this.tokens = tokens;
    let allcombine = arrayCombine(this.paths, 2);
    let combines = allcombine.reduce((res: string[][], item) => {
      let [a, b] = item;
      let aext = getFileExt(a);
      let bext = getFileExt(b);
      if (aext === undefined || bext === undefined) {
        return res;
      }
      // 按文件后缀过滤不属于同一分组的文件, 对比不同类型文件没有意义
      let exts = getexts(aext);
      if (exts.includes(bext)) {
        res.push(item);
      }
      return res;
    }, []);
    this.combines = combines;
    // console.log(this.paths, '======this.paths======');
    // console.log(this.combines, '======this.combines======');
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
  async update (event: FileChangeType, filepath: string): Promise<void> {
    if (event === FileChangeType.Deleted) {
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
      tokens: tokenizer.tokens,
      stringtokens: tokenizer.stringtokens
    };
    this.datas[filepath] = item;
    if (m === true) {
      this.pathGroupGenerator();
    }
    return item;
  }
}