import { FileUtil } from '../utils/files';
import { Config } from '../utils/config';
import { IDuplication } from '../index.d';
import { dup, dupall } from '../utils/duplication';
import { IConnection, Diagnostic, DiagnosticRelatedInformation, Location, Range } from 'vscode-languageserver';
import keyBy from 'lodash-es/keyBy';
export const CODE_ACTION = 'goto-duplication';

export class Provider {
  file: FileUtil;
  diffs: { [key: string]: IDuplication } = {};
  loading: number = 0;
  constructor (public context: IConnection, file: FileUtil, public config: Config) {
    this.context = context;
    this.config = config;
    this.file = file;
  }
  async onChanges (): Promise<IDuplication[]> {
    let p = this.file.paths;
    if (!this.config.root) {
      return [];
    }
    this.loading++;
    // console.time('changes');
    let diff = await dupall(this.file, this.config.minTokens);
    this.diffs = keyBy(diff, 'key');
    for (let index = 0; index < p.length; index++) {
      const filename = p[index];
      let find = diff.reduce((res: IDuplication[], next) => {
        if (next.a.filename === filename) {
          res.push({
            key: next.key,
            a: next.a,
            b: next.b
          });
        }
        if (next.b.filename === filename && next.a.filename !== filename) {
          res.push({
            key: next.key,
            a: next.b,
            b: next.a
          });
        }
        return res;
      }, []);
      this.setdiagnostics(filename, find);
    }
    this.loading--;
    // console.timeEnd('changes');
    return diff;
  }
  setdiagnostics (filename: string, diff: IDuplication[]): void {
    let diagnostics: Diagnostic[] = [];
    this.context.sendDiagnostics({
      uri: filename,
      diagnostics
    });
    diff.forEach((obj) => {
      let range = Range.create(obj.a.start.line - 1, obj.a.start.col - 1, obj.a.end.line - 1, obj.a.end.col - 1);
      let otherRange = Range.create(obj.b.start.line - 1, obj.b.start.col - 1, obj.b.end.line - 1, obj.b.end.col - 1);
      let diagnostic = Diagnostic.create(range, `duplication`, this.config.severity);
      if (diagnostic) {
        diagnostic.relatedInformation = [DiagnosticRelatedInformation.create(Location.create(obj.b.filename, otherRange), 'duplication')];
        diagnostics.push(diagnostic);
      }
    });
    if (diagnostics.length <= 0) {
      return;
    }
    this.context.sendDiagnostics({
      uri: filename,
      diagnostics
    });
  }
  async onChange (filename: string): Promise<IDuplication[]> {
    // console.time('change');
    this.loading++;
    let diff = await dup(filename, this.file, this.config.minTokens);
    let diffs = keyBy(diff, 'key');
    Object.assign(this.diffs, diffs);
    this.setdiagnostics(filename, diff);
    // console.timeEnd('change');
    this.loading--;
    return diff;
  }
}