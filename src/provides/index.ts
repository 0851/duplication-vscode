import { FileData, Files } from '../utils/files';
import {
  ExtensionContext, languages, Uri, Range,
  Diagnostic,
  DiagnosticCollection,
  DiagnosticRelatedInformation,
  Location
} from 'vscode';
import { Config } from '../utils/config';
import { IClone } from '../utils/files';
import debounce from 'lodash-es/debounce';
export const CODE_ACTION = 'goto-duplication';

interface DebouncedFunc<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel (): void;
  flush (): ReturnType<T> | undefined;
}
export class Provider {
  diagnosticCollection: DiagnosticCollection;
  onChange: DebouncedFunc<(sourceId: string, clones?: IClone[]) => Promise<void>>;
  onChanges: DebouncedFunc<(clones?: IClone[]) => Promise<void>>;
  file: Files;
  constructor (public context: ExtensionContext, file: Files, public config: Config) {
    this.context = context;
    this.config = config;
    this.file = file;
    this.diagnosticCollection = languages.createDiagnosticCollection('duplication');
    context.subscriptions.push(this.diagnosticCollection);
    this.onChange = debounce(this._onChange.bind(this));
    this.onChanges = debounce(this._onChanges.bind(this));
  }
  async _onChanges (clones?: IClone[]): Promise<void> {
    this.diagnosticCollection.clear();
    if (!clones) {
      clones = await this.file.clones();
    }
    let sourceIds = [...new Set(clones.reduce((res: string[], clone) => {
      res.push(clone.a.filename);
      res.push(clone.b.filename);
      return res;
    }, []))];
    while (sourceIds) {
      let sourceId = sourceIds.shift();
      if (!sourceId) {
        return;
      }
      this._onChange(sourceId, clones);
    }
  }
  async _onChange (sourceId: string, clones?: IClone[]): Promise<void> {
    let uri = Uri.parse(sourceId);
    this.diagnosticCollection.delete(uri);

    if (!clones) {
      // clones = await this.file.getClones();
    }

    let diagnostics: Diagnostic[] = [];
    // let errs = getDuplication(sourceId, clones);
    // errs.forEach((err) => {
    //   let source = err.source;
    //   let others = err.refs;
    //   others.forEach((other) => {
    //     let range = new Range(source.start.line, source.range[0], source.end.line, source.range[1]);
    //     let otherRange = new Range(other.start.line, other.range[0], other.end.line, other.range[1]);
    //     let diagnostic = new Diagnostic(range, `duplication`, this.config.severity);
    //     if (diagnostic) {
    //       // diagnostic.code = CODE_ACTION;
    //       diagnostic.relatedInformation = [new DiagnosticRelatedInformation(new Location(Uri.parse(other.sourceId), otherRange), 'duplication')];
    //       diagnostics.push(diagnostic);
    //     }
    //   });
    // });
    this.diagnosticCollection.set(uri, diagnostics);
  }
  // 停止比对文件
  stop () {
    this.diagnosticCollection.clear();
  }
}