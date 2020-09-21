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
  value: string,
  filename: string,
  start: ILoc,
  end: ILoc,
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

export interface IDuplication {
  a: Omit<IToken, 'content'>
  b: Omit<IToken, 'content'>
}
