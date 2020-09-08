
import { read, watch, File, WatchEventName, hasOwnProperty } from '.';
import * as fs from 'fs';
import * as globby from 'globby';
import * as bytes from 'bytes';
import { Config } from './config';
import * as eventemitter3 from 'eventemitter3';
import { detectClones, detectOne } from './clones';
import {
  Detector,
  ICloneValidator,
  IClone,
  IStore,
  IMapFrame,
  ITokenizer,
  MemoryStore,
  ITokenLocation,
  IBlamedLines
} from '@jscpd/core';
import { Tokenizer } from '@jscpd/tokenizer';
import { clone } from 'lodash-es';
export interface FileData {
  [filepath: string]: File
}

export interface FileClone {
  [filepath: string]: IClone[]
}

class Store extends MemoryStore<IMapFrame> {
  constructor () {
    super();
  }
  removeBySourceId (sourceId: string, namespace: string) {
    let namespaces = this.values[namespace] || {};
    Object.keys(namespaces).forEach((key) => {
      let obj = namespaces[key];
      if (obj.sourceId === sourceId) {
        delete this.values[namespace][key];
      }
    });
  }
}


export class Files extends eventemitter3 {
  datas: FileData;
  tokenizer: ITokenizer;
  validators: ICloneValidator[];
  store: Store;
  detector: Detector;
  watch: (() => Promise<void>) | undefined;
  constructor (public config: Config) {
    super();
    this.datas = {};
    this.config = config;
    this.tokenizer = new Tokenizer();
    this.validators = [];
    this.store = new Store();
    this.detector = new Detector(this.tokenizer, this.store, this.validators, {
      minLines: this.config.minLines,
      maxLines: this.config.maxLines,
      minTokens: this.config.minTokens
    });
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
    // this.watch = watch(`${this.config.root}/**/*`, debounce(this.update.bind(this)), this.config);
    let datas = await this.reads(paths);
    return datas;
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
      // await this.changeClone(filepath, file.format, nf);
    }
  }
  // async changeClone (filepath: string, format: string, file: File) {
  // this.store.removeBySourceId(filepath, format);
  // let clones = this.clones
  //   .filter((clone) => {
  //     return clone.duplicationA.sourceId !== filepath;
  //   });
  // let nc = await detectOne(this.detector, file);
  // console.log(nc);
  // clones.push(...nc);
  // this.clones = clones;
  // }
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
    let file = this.get(filepath);
    if (event === 'unlink' || event === 'error') {
      this.remove(filepath);
    }
    await this._read(filepath);
    // await this.changeClone(filepath, file?.format || '', this.get(filepath) || ({ ...file, content: '' } as File));
    this.emit('update');
  }
  async getClones (): Promise<IClone[]> {
    let clones = await detectClones(this.datas, this.detector) || [];
    return clones;
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