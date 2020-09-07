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

interface Duplication {
  sourceId: string;
  start: ITokenLocation;
  end: ITokenLocation;
  range: [number, number];
  fragment?: string;
  blame?: IBlamedLines;
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
  let stack = [...files];
  while (stack.length) {
    let item = stack.shift();
    if (!item) {
      break;
    }
    let clone = await detectOne(detector, item);
    clones.push(...clone);
  }
  return clones;
}
// 计算重复有点问题
export function getDuplication (f: string, clones: IClone[]): IClone[] {
  let dups: IClone[] = [];
  let stack = [...clones];
  while (stack.length) {
    let clone = stack.shift();
    if (!clone) {
      break;
    }
    if (clone.duplicationA.sourceId === f || clone.duplicationB.sourceId === f) {
      dups.push(clone);
    }
  }
  return dups;
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