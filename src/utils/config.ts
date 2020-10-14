import { IConnection, DocumentUri, DiagnosticSeverity } from 'vscode-languageserver';
export const MainCommand = "extension.duplication.exec";
export const ExecEndCommand = `extension.duplication.end`;
export const ShowCommand = `extension.duplication.show`;
export const ShowQuickPickCommand = 'duplication.showQuickPick';
export const ChangeActiveTextCommand = 'duplication.ChangeActiveTextCommand';
export const ChangeResultCommand = 'duplication.ChangeResultCommand';

export const OpenFileCommand = `extension.duplication.open`;
export const TreeRefreshCommand = `extension.duplication.treeview.refresh`;

export const ServerId = 'Language Server Duplication';

export const DebounceWait = 500;

export class Config {
  data: { [key: string]: any } = {};
  constructor (public c: IConnection, public root: DocumentUri | null) {
    this.c = c;
    this.root = root;
  }
  async changeConfig () {
    let keys = [
      'duplication.ignore',
      'duplication.minTokens',
      'duplication.maxTokens',
      'duplication.debounceWait',
      'duplication.maxSize',
      'duplication.debug',
      'duplication.severity'
    ];
    await Promise.all(keys.map(async (key) => {
      let s = await this.c.workspace.getConfiguration(key);
      this.data[key] = s;
    }));
  }
  get ignore (): string[] {
    return this.data['duplication.ignore'] || [
      "**/node_modules/**/*",
      "**/bower_components",
      "**/jspm_packages",
      "**/web_modules",
      "**/.cache",
      "**/.history",
      "**/.yarn/cache",
      "**/.vscode-test",
      "**/.idea",
      "**/.vscode",
      "**/.git",
      "**/logs",
      "**/mock",
      "dist",
      "build",
      "out"
    ];
  }
  get minTokens (): number {
    return this.data['duplication.minTokens'] || 30;
  }
  get maxTokens (): number {
    return this.data['duplication.maxTokens'] || 500;
  }
  get minLine (): number {
    return this.data['duplication.minLine'] || 5;
  }
  get debounceWait (): number {
    return this.data['duplication.debounceWait'] || DebounceWait;
  }
  get maxSize (): string {
    return this.data['duplication.maxSize'] || '20kb';
  }
  get debug (): boolean {
    return this.data['duplication.debug'] || false;
  }
  get severity (): DiagnosticSeverity {
    return this.data['duplication.severity'] || 2;
  }
}