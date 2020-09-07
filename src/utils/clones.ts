import {
  Detector,
  MemoryStore,
  ICloneValidator,
  IClone,
  IStore,
  IMapFrame,
  ITokenizer,
  ITokenLocation,
  IBlamedLines
} from '@jscpd/core';
import { Tokenizer } from '@jscpd/tokenizer';
import { FileData } from './files';
import { Config } from './config';
import { File } from '.';

export { IClone };

export interface Duplication {
  sourceId: string;
  start: ITokenLocation;
  end: ITokenLocation;
  range: [number, number];
  fragment?: string | undefined;
  blame?: IBlamedLines | undefined;
}
export interface Duplications {
  source: Duplication
  refs: Duplication[]
  format: string;
  foundDate?: number;
}
function getItems (datas: FileData): File[] {
  return Object.keys(datas).reduce((res: File[], next: string) => {
    let item = datas[next];
    res.push(item);
    return res;
  }, []);
}
async function detectOne (detector: Detector, item: File): Promise<IClone[]> {
  try {
    if (!item) {
      return [];
    }
    return await detector.detect(item.filepath, item.content, item.format);
  } catch (error) {
    return [];
  }
}
async function exec (files: File[], detector: Detector): Promise<IClone[]> {
  let clones = [];
  for (let index = 0; index < files.length; index++) {
    const item = files[index];
    let clone = await detectOne(detector, item);
    clones.push(...clone);
  }
  return clones;
}

function getDuplicationKeyKey (obj: Duplication) {
  return `${obj.sourceId}-${obj.range[0]}-${obj.range[1]}`;
}
function duplicationKey (clone: IClone): { keyA: string, keyB: string } {
  return {
    keyA: getDuplicationKeyKey(clone.duplicationA),
    keyB: getDuplicationKeyKey(clone.duplicationB)
  };
}

export function getDuplicationItem (clone: IClone, clones: IClone[]): Duplication[] {
  let res: Duplication[] = [];
  let keys = [duplicationKey(clone).keyA, duplicationKey(clone).keyB];
  for (let index = 0; index < clones.length; index++) {
    const element = clones[index];
    let key = duplicationKey(element);
    if (keys.includes(key.keyA)) {
      res.push(element.duplicationB);
    }
    if (keys.includes(key.keyB)) {
      res.push(element.duplicationA);
    }
  }
  return res;
}
export function filterDuplication (dup: Duplication, dups: Duplication[]): Duplication[] {
  return dups.filter((item) => {
    let sKey = getDuplicationKeyKey(item);
    let key = getDuplicationKeyKey(dup);
    return sKey !== key;
  });
}
export function getDuplication (f: string, clones: IClone[]): Duplications[] {
  let dups: Duplications[] = [];
  for (let index = 0; index < clones.length; index++) {
    const clone = clones[index];

    let refs = getDuplicationItem(clone, clones);

    dups.push({
      source: clone.duplicationA,
      refs: filterDuplication(clone.duplicationA, refs),
      format: clone.format,
      foundDate: clone.foundDate
    });
    dups.push({
      source: clone.duplicationB,
      refs: filterDuplication(clone.duplicationB, refs),
      format: clone.format,
      foundDate: clone.foundDate
    });
  }
  return dups.filter((dup) => {
    return dup.source.sourceId === f;
  });
}
export async function detectClones (datas: FileData, config: Config): Promise<IClone[]> {
  try {
    let stack = getItems(datas);
    const tokenizer: ITokenizer = new Tokenizer();
    const validators: ICloneValidator[] = [];
    const store: IStore<IMapFrame> = new MemoryStore();
    const detector = new Detector(tokenizer, store, validators, {
      minLines: config.minLines,
      maxLines: config.maxLines,
      minTokens: config.minTokens
    });
    return await exec(stack, detector);
  } catch (error) {
    throw error;
  }
}