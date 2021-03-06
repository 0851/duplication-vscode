export interface IFileToken extends IFile {
  tokens: IToken[]
  stringtokens: string[]
}
export interface IFileData {
  [filepath: string]: IFileToken
}

export interface IPathTokenGroup {
  [key: string]: IToken[]
}

export interface IDebouncedFunc<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel (): void;
  flush (): ReturnType<T> | undefined;
}

export interface IFile {
  filepath: string
  content: string
}

export interface IToken {
  filename: string,
  start: ILoc,
  end: ILoc,
  value: string,
  content: string
}
export interface ILoc {
  pos: number,
  line: number,
  col: number
}

export type IShingles = {
  [hashcode: string]: IToken[]
};

export type IDuplicationToken = Omit<IToken, 'content' | 'value'>;

export interface IDuplication {
  // key: string
  a: IDuplicationToken
  b: IDuplicationToken
}
export interface IFORMATS {
  [key: string]: {
    exts: string[],
    parent?: string
  }
}