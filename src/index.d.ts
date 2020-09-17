export interface IFileData {
  [filepath: string]: IFile & {
    tokens: IToken[]
  }
}

export interface IPathGroup {
  [key: string]: [string, string][]
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

export interface IDuplication {
  a: IToken,
  b: IToken
}
