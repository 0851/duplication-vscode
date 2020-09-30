import { IToken, ILoc } from '../index.d';

// 常规的注释 https://zh.wikipedia.org/wiki/%E6%B3%A8%E9%87%8A_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E8%AF%AD%E8%A8%80)

// 空白
let space_reg = /^\s+/;
// 字符串
let string_reg1 = /^'+(?<value>[\s\S]*?)'+/;
let string_reg2 = /^"+(?<value>[\s\S]*?)"+/;
let string_reg3 = /^`+(?<value>[\s\S]*?)`+/;

let comment_reg1 = /^\s*\/\/[^\n]*\s*/; //   //
let comment_reg2 = /^\s*\/\*[\s\S]+?\*\/\s*/;  // /** */
let comment_reg3 = /^\s*\/\#[\s\S]+?\#\/\s*/; // /# #/
let comment_reg4 = /^\s*\#[^\n]*\s*/; // #
let comment_reg5 = /^\s*\-\-[^\n]*\s*/; // --
let comment_reg6 = /^\s*\<\!\-[\s\S]+?\-\>\s*/; // <!- ->
let comment_reg7 = /^\s*\|\#[\s\S]+?\#\|\s*/; // |# #|
let comment_reg8 = /^\s*\'\'\'[\s\S]+?\'\'\'\s*/; // ''' '''
let comment_reg9 = /^\s*\"\"\"[\s\S]+?\"\"\"\s*/; // """ """
let comment_reg10 = /^\s*\#\|[\s\S]+?\|\#\s*/; // #| |#

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
    // 去掉注释,空
    if (
      this.by_reg(comment_reg1) !== undefined ||
      this.by_reg(comment_reg2) !== undefined ||
      this.by_reg(comment_reg3) !== undefined ||
      this.by_reg(comment_reg4) !== undefined ||
      this.by_reg(comment_reg5) !== undefined ||
      this.by_reg(comment_reg6) !== undefined ||
      this.by_reg(comment_reg7) !== undefined ||
      this.by_reg(comment_reg8) !== undefined ||
      this.by_reg(comment_reg9) !== undefined ||
      this.by_reg(comment_reg10) !== undefined ||
      this.by_reg(space_reg) !== undefined
    ) {
      return undefined;
    };
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
