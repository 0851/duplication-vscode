import { IToken, ILoc } from '../index.d';
// 空白
let space_reg = /^\s+/;
// 字符串
let string_reg1 = /^'+(?<value>[\s\S]*?)'+/;
let string_reg2 = /^"+(?<value>[\s\S]*?)"+/;
let string_reg3 = /^`+(?<value>[\s\S]*?)`+/;

let key_reg = /^[a-zA-Z0-9\$\_][a-zA-Z0-9\_\-\$\.]*/;

let sym_reg = /^[\~\!\@\#\$\%\^\&\*\(\)\{\}\[\]\\\=\+\|\;\:\,\.\/\<\>\?]+/;

let number_reg = /^[0-9]*[0-9a-fA-FeE\-\+\.]+/;

// 其他token
let n_reg = /\n/;

let any_reg = /^.+?(?=\s|$)/;

function tokenizer_generator (
  start: ILoc,
  end: ILoc,
  value: string,
  filename: string,
  content: string
): IToken {
  return {
    value,
    start,
    end,
    filename,
    content
  };
}

class Tokenizer {
  readonly source: string;
  private pos: number;
  private line: number;
  private col: number;
  tokens: IToken[] = [];
  stringtokens: string[] = [];
  constructor (public input: string = '', public filename: string) {
    this.input = input;
    this.source = input;
    this.filename = filename;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
  }
  exec () {
    this.next_all();
  }
  get_loc (): ILoc {
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
    // 去掉空
    let empty = this.by_reg(space_reg);
    if (empty !== undefined) {
      return undefined;
    }
    // 特殊字符
    let sym = this.by_reg(sym_reg);
    if (sym !== undefined && this.tokens.length > 0) {
      let endtoken = this.tokens[this.tokens.length - 1];
      this.by_reg(space_reg);
      this.tokens[this.tokens.length - 1] = {
        ...endtoken,
        end: this.get_loc(),
        value: `${endtoken.value}${sym}`
      };
      return undefined;
    }
    let start_loc = this.get_loc();
    let v = this.by_reg(string_reg1);
    if (!v) {
      v = this.by_reg(string_reg2);
    }
    if (!v) {
      v = this.by_reg(string_reg3);
    }
    if (!v) {
      v = this.by_reg(key_reg);
    }
    if (!v) {
      v = this.by_reg(number_reg);
    }
    if (!v) {
      v = this.by_reg(any_reg);
    }
    if (!v) {
      return undefined;
    }
    let end_loc = this.get_loc();
    let token = tokenizer_generator(start_loc, end_loc, v, this.filename, this.source);
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
  eof (): boolean {
    return this.input.length <= 0;
  }
  next_all (): IToken[] {
    this.tokens = [];
    while (!this.eof()) {
      let item = this.next();
      if (item !== undefined) {
        this.tokens.push(item);
      }
    }
    this.stringtokens = this.tokens.map((token) => {
      return token.value;
    });
    return this.tokens;
  }
}
export default Tokenizer;
export { Tokenizer };
