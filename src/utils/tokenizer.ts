import * as XXH from 'xxhashjs';
export interface IToken {
  value: string,
  filename: string,
  start: Loc,
  end: Loc
}
export interface Loc {
  pos: number,
  line: number,
  col: number
}

export type IShingles = {
  [hashcode: string]: IToken
};

// 空白
let space_reg = /^\s+/;
// 字符串
let string_reg = /^([\'\"\`]+)(?<value>(?:[^\1])*?)\1/;
// 其他token
let other_reg = /^.+?(?=\s)/;

let n_reg = /\n/;

let any_reg = /^.+/;

function tokenizer_generator (
  start: Loc,
  end: Loc,
  value: string,
  filename: string
): IToken {
  return {
    value,
    start,
    end,
    filename
  };
}
let count = 0;
class Tokenizer {
  readonly source: string;
  private peek_stack: IToken[];
  private pos: number;
  private line: number;
  private col: number;
  shingles: IShingles = {};
  tokens: IToken[] = [];
  constructor (public input: string = '', public filename: string, public k: number = 50) {
    this.input = input;
    this.source = input;
    this.filename = filename;
    this.peek_stack = [];
    this.pos = 0;
    this.line = 1;
    this.col = 1;
    this.k = k;
  }
  exec () {
    this.next_all();
    this.make_shingles();
  }
  hash (str: string): string {
    // hash计算速度慢
    // var h = XXH.h64(str, 0xABCB).toString(16);
    return (count++).toString();
  }
  make_shingles () {
    let tokens = this.tokens;
    for (let index = 0; index < tokens.length; index++) {
      const element = tokens.slice(index, (this.k + index + 1));
      let filename = this.filename;
      let start = element[0].start;
      let end = element[element.length - 1].end;
      let value = this.source.slice(start.pos, end.pos);
      this.shingles[this.hash(value)] = {
        filename,
        start,
        end,
        value
      };
    }
  }
  get_loc (): Loc {
    return {
      pos: this.pos,
      line: this.line,
      col: this.col
    };
  }
  by_reg (reg: RegExp, newline: boolean = true, input: string = this.input): string | undefined {
    let matched = reg.exec(input);
    if (!matched) {
      return undefined;
    }
    let source = matched[0];
    if (newline === true && n_reg.test(source)) {
      let arr = source.split('\n');
      let o = 0;
      while (arr.length > 0) {
        o++;
        let str = arr.shift();
        if (str === undefined) {
          break;
        }
        let l = 0;
        let c = 0;
        if (o !== 1) {
          l = 1;
          c = 1;
        }
        c += str.length;
        this.move(c, l);
      }
    } else {
      this.move(source.length, 0);
    }
    return source;
  }
  next (): IToken | undefined {
    if (this.peek_stack.length > 0) {
      return this.peek_stack.shift();
    }
    // 去掉空
    this.by_reg(space_reg);
    if (this.input.length <= 0) {
      return undefined;
    }
    let start_loc = this.get_loc();

    let v = this.by_reg(string_reg);
    if (!v) {
      v = this.by_reg(other_reg) || '';
    }
    if (!v) {
      v = this.by_reg(any_reg) || '';
    }
    let end_loc = this.get_loc();
    let token = tokenizer_generator(start_loc, end_loc, v, this.filename);
    return token;
  }
  move (i: number = 1, line: number = 0): void {
    this.input = this.input.substr(i);
    this.pos = this.pos + i;
    if (line > 0) {
      this.line = this.line + line;
      this.col = 0 + i;
      return;
    }
    this.col = this.col + i;
  }
  peek (): undefined | IToken {
    let next = this.next();
    if (next) {
      this.peek_stack.push(next);
    }
    return this.peek_stack[0];
  }
  eof (): boolean {
    return this.peek() === undefined;
  }
  next_all (): IToken[] {
    let tokens: IToken[] = [];
    while (!this.eof()) {
      let item = this.next();
      if (item !== undefined) {
        tokens.push(item);
      }
    }
    this.tokens = tokens;
    return tokens;
  }
}
export default Tokenizer;
export { Tokenizer };
