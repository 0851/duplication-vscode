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
import { read, File } from '.';

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
    res.push({
      path: item.filepath,
      content: item.source,
      format: item.format,
      stats: item.stats
    });
    return res;
  }, []);
}
async function detectOne (detector: Detector, item: File): Promise<IClone[]> {
  try {
    if (!item) {
      return [];
    }
    return await detector.detect(item.path, item.content, item.format);
  } catch (error) {
    return [];
  }
}
async function exec (stack: File[], detector: Detector): Promise<Duplication[]> {
  let clones = [];
  let f = stack[0];
  while (stack.length) {
    let item = stack.shift();
    if (!item) {
      break;
    }
    let clone = await detectOne(detector, item);
    clones.push(...clone);
  }
  return getDuplication(f, clones);
}
function getDuplication (f: File, clones: IClone[]): Duplication[] {
  let dups: Duplication[] = [];
  while (clones.length) {
    let clone = clones.shift();
    if (!clone) {
      break;
    }
    if (clone.duplicationA.sourceId === f.path && clone.duplicationB.sourceId !== f.path) {
      dups.push({
        ...clone.duplicationB,
        format: clone.format,
        foundDate: clone.foundDate
      });
    }
    if (clone.duplicationB.sourceId === f.path && clone.duplicationA.sourceId !== f.path) {
      dups.push({
        ...clone.duplicationA,
        format: clone.format,
        foundDate: clone.foundDate
      });
    }
  }
  return dups;
}
export async function detectClones (f: string, datas: FileData, config: Config): Promise<Duplication[]> {
  try {
    let stack = getItems(datas);
    let item = await read(f, config);
    if (!item) {
      return [];
    }
    stack.unshift(item);
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