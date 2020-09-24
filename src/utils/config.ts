import { IConnection, DocumentUri, DiagnosticSeverity } from 'vscode-languageserver';
export const Command = "extension.duplication";
export const ExecStartCommand = `extension.duplicationstart`;
export const ExecEndCommand = `extension.duplicationend`;
export const ShowCommand = `extension.duplicationshow`;
export const ShowQuickPickCommand = 'duplication.showQuickPick';
export const ChangeActiveTextCommand = 'duplication.ChangeActiveTextCommand';
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
      "node_modules/**/*",
      "bower_components",
      "jspm_packages",
      "web_modules",
      ".cache",
      ".history",
      ".yarn/cache",
      ".vscode-test",
      ".idea",
      ".vscode",
      ".git",
      "out",
      "dist",
      "build",
      "logs"
    ];
  }
  get minTokens (): number {
    return this.data['duplication.minTokens'] || 50;
  }
  get debounceWait (): number {
    return this.data['duplication.debounceWait'] || DebounceWait;
  }
  get maxSize (): string {
    return this.data['duplication.maxSize'] || '100kb';
  }
  get debug (): boolean {
    return this.data['duplication.debug'] || false;
  }
  get severity (): DiagnosticSeverity {
    return this.data['duplication.severity'] || 2;
  }
}