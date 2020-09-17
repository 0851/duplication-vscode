import { Files } from '../utils/files';
import {
  ExtensionContext, languages, Uri, Range,
  Diagnostic,
  DiagnosticCollection,
  DiagnosticRelatedInformation,
  Location
} from 'vscode';
import { Config } from '../utils/config';
import { IDebouncedFunc } from '../index.d';
import debounce from 'lodash-es/debounce';
export const CODE_ACTION = 'goto-duplication';
import { dup } from '../utils/duplication';

export class Provider {
  diagnosticCollection: DiagnosticCollection;
  onChange: IDebouncedFunc<(sourceId: string) => Promise<void>>;
  onChanges: IDebouncedFunc<() => Promise<void>>;
  file: Files;
  constructor (public context: ExtensionContext, file: Files, public config: Config) {
    this.context = context;
    this.config = config;
    this.file = file;
    this.diagnosticCollection = languages.createDiagnosticCollection('duplication');
    context.subscriptions.push(this.diagnosticCollection);
    this.onChange = debounce(this._onChange.bind(this), config.debounceWait);
    this.onChanges = debounce(this._onChanges.bind(this), config.debounceWait);
  }
  async _onChanges (): Promise<void> {
    this.diagnosticCollection.clear();
    let p = this.file.paths;
    let actions = [];
    console.time('changes');
    for (let index = 0; index < p.length; index++) {
      const filename = p[index];
      let uri = Uri.parse(filename);
      actions.push(this.setone(filename, uri));
    }
    await Promise.all(actions);
    console.timeEnd('changes');
  }
  async setone (filename: string, uri: Uri): Promise<void> {
    let comb = this.file.groups[filename];
    if (comb.length <= 0) {
      return;
    }
    let diagnostics: Diagnostic[] = [];
    let diff = dup(comb, this.file.datas, this.config.minTokens);
    diff.forEach((obj) => {
      let range = new Range(obj.a.start.line - 1, obj.a.start.col - 1, obj.a.end.line - 1, obj.a.end.col - 1);
      let otherRange = new Range(obj.b.start.line - 1, obj.b.start.col - 1, obj.b.end.line - 1, obj.b.end.col - 1);
      let diagnostic = new Diagnostic(range, `duplication`, this.config.severity);
      if (diagnostic) {
        diagnostic.relatedInformation = [new DiagnosticRelatedInformation(new Location(Uri.parse(obj.b.filename), otherRange), 'duplication')];
        diagnostics.push(diagnostic);
      }
    });
    if (diagnostics.length <= 0) {
      return;
    }
    this.diagnosticCollection.set(uri, diagnostics);
  }
  async _onChange (filename: string): Promise<void> {
    console.time('change');
    let uri = Uri.parse(filename);
    this.diagnosticCollection.delete(uri);
    await this.setone(filename, uri);
    console.timeEnd('change');
  }
  // 停止比对文件
  stop () {
    this.diagnosticCollection.clear();
  }
}