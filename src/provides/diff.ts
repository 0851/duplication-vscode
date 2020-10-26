import { FileUtil } from '../utils/files';
import { Config } from '../utils/config';
import { IDuplication } from '..';
import { Dup } from '../utils/duplication';
import { IConnection, Diagnostic, DiagnosticRelatedInformation, Location, Range } from 'vscode-languageserver';
import keyBy from 'lodash-es/keyBy';
import { removeRoot } from '../utils';
import values from 'lodash-es/values';
import sortBy from 'lodash-es/sortBy';
export class Provider {
  file: FileUtil;
  diffs: { [key: string]: IDuplication } = {};
  dupall: Dup | undefined;
  dupone: Dup | undefined;
  constructor (public context: IConnection, file: FileUtil, public config: Config) {
    this.context = context;
    this.config = config;
    this.file = file;
  }
  diffsValues () {
    let res = values(this.diffs);
    res = sortBy(res, (o) => { return o.a.filename; });
    return res;
  }
  clearDiff (filename: string) {
    let keys = Object.keys(this.diffs);
    keys.sort();
    this.diffs = keys.reduce((res: { [key: string]: IDuplication } = {}, key: string) => {
      if (key.indexOf(filename) < 0) {
        res[key] = this.diffs[key];
      }
      return res;
    }, {});
  }
  findDiff (diff: IDuplication[], filename: string) {
    let res = diff.reduce((res: IDuplication[], next) => {
      if (next.a.filename === filename) {
        res.push({
          a: next.a,
          b: next.b
        });
      } else if (next.b.filename === filename) {
        res.push({
          a: next.b,
          b: next.a
        });
      }
      return res;
    }, []);
    return res;
  }
  filterDiff () {
    let keys = Object.keys(this.diffs);
    keys.sort();
    this.diffs = keys.reduce((res: { [key: string]: IDuplication } = {}, key: string) => {
      let find = this.file.paths.find((path) => {
        return key.indexOf(path) > -1;
      });
      if (find) {
        res[key] = this.diffs[key];
      }
      return res;
    }, {});
  }
  stop () {
    this.dupall && this.dupall.stop();
    this.dupone && this.dupone.stop();
  }
  async onChanges (): Promise<IDuplication[]> {
    let p = this.file.paths;
    if (!this.config.root) {
      return [];
    }
    this.dupall && this.dupall.stop();
    this.dupall = new Dup(this.file, this.config);
    let diff = await this.dupall.run();
    this.diffs = keyBy(diff, 'key');
    this.filterDiff();
    this.config.debug === true && console.time('changes');
    for (let index = 0; index < p.length; index++) {
      const filename = p[index];
      let find = this.findDiff(diff, filename);
      this.setDiagnostics(filename, find);
    }
    this.config.debug === true && console.timeEnd('changes');
    return diff;
  }
  setDiagnostics (filename: string, diff: IDuplication[]): void {
    let diagnostics: Diagnostic[] = [];
    this.context.sendDiagnostics({
      uri: filename,
      diagnostics
    });
    diff.forEach((obj) => {
      let range = Range.create(obj.a.start.line - 1, obj.a.start.col - 1, obj.a.end.line - 1, obj.a.end.col - 1);
      let otherRange = Range.create(obj.b.start.line - 1, obj.b.start.col - 1, obj.b.end.line - 1, obj.b.end.col - 1);
      let diagnostic = Diagnostic.create(
        range,
        `duplication`,
        this.config.severity
      );
      if (diagnostic) {
        diagnostic.relatedInformation = [
          DiagnosticRelatedInformation.create(
            Location.create(obj.b.filename, otherRange),
            `${removeRoot(obj.b.filename, this.config.root || '')}`
          )
        ];
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
    this.config.debug === true && console.time(`change ${filename}`);
    this.clearDiff(filename);
    this.dupone && this.dupone.stop();
    this.dupone = new Dup(this.file, this.config, filename);
    let diff = await this.dupone.run();
    let diffs = keyBy(diff, 'key');
    Object.assign(this.diffs, diffs);
    this.filterDiff();
    let res = this.findDiff(diff, filename);
    this.setDiagnostics(filename, res);
    this.config.debug === true && console.timeEnd(`change ${filename}`);
    return res;
  }
}