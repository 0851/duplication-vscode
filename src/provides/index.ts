import { FileData } from '../utils/files';
import {
  ExtensionContext, languages, Uri, Range,
  Diagnostic,
  DiagnosticCollection,
  DiagnosticRelatedInformation,
  Location
} from 'vscode';
import { detectClones, getDuplication, IClone } from '../utils/clones';
import { Config } from '../utils/config';
import { debounce } from '../utils';
export const CODE_ACTION = 'goto-duplication';


export class Provider {
  diagnosticCollection: DiagnosticCollection;
  onChange: (sourceId: string, clones?: IClone[]) => Promise<void>;
  onChanges: () => Promise<void>;
  constructor (public context: ExtensionContext, public files: FileData, public config: Config) {
    this.context = context;
    this.files = files;
    this.config = config;
    this.diagnosticCollection = languages.createDiagnosticCollection('duplication');
    context.subscriptions.push(this.diagnosticCollection);
    this.onChange = debounce(this._onChange);
    this.onChanges = debounce(this._onChanges);
  }
  async _onChanges (): Promise<void> {
    this.diagnosticCollection.clear();
    let clones = await detectClones(this.files, this.config);
    let sourceIds = [...new Set(clones.reduce((res: string[], clone) => {
      res.push(clone.duplicationA.sourceId);
      res.push(clone.duplicationB.sourceId);
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
      clones = await detectClones(this.files, this.config);
    }
    let errs = getDuplication(sourceId, clones);

    let diagnostics: Diagnostic[] = [];
    errs.forEach((err) => {
      let source = err.source;
      let others = err.refs;
      others.forEach((other) => {
        let range = new Range(source.start.line, source.range[0], source.end.line, source.range[1]);
        let otherRange = new Range(other.start.line, other.range[0], other.end.line, other.range[1]);
        let diagnostic = new Diagnostic(range, `duplication`, this.config.severity);
        if (diagnostic) {
          diagnostic.code = CODE_ACTION;
          // let message = this.files[other.sourceId].content.slice(other.range[0], other.range[1]);
          diagnostic.relatedInformation = [new DiagnosticRelatedInformation(new Location(Uri.parse(other.sourceId), otherRange), '')];
          diagnostics.push(diagnostic);
        }
      });
    });
    this.diagnosticCollection.set(uri, diagnostics);
  }
  // 重设所有文件内容对象
  set_files (files: FileData) {
    this.files = files;
  }
  // 停止比对文件
  stop () {
    this.diagnosticCollection.clear();
  }
}