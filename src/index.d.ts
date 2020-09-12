import * as fs from 'fs';
export interface IFileData {
  [filepath: string]: IFile
}
export interface IClone {
  a: IToken
  b: IToken
}
export interface IDebouncedFunc<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel (): void;
  flush (): ReturnType<T> | undefined;
}

export interface IFile {
  filepath: string
  content: string
  tokens: IToken[]
}

export interface IToken {
  value: string,
  filename: string,
  start: ILoc,
  end: ILoc
}
export interface ILoc {
  pos: number,
  line: number,
  col: number
}

export type IShingles = {
  [hashcode: string]: IToken[]
};
