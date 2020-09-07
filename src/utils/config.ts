import { workspace, DiagnosticSeverity } from 'vscode';
export class Config {
  get root (): string | undefined {
    return (workspace.workspaceFolders || [])[0]?.uri?.path;
  }
  get ignore (): string[] {
    return workspace.getConfiguration('duplication')
      .get<string[]>('ignore') || [
        'node_modules/**/*',
        'bower_components',
        'jspm_packages',
        'web_modules',
        '.cache',
        '.history',
        '.yarn/cache',
        '.vscode-test',
        'out',
        'dist',
        'build',
        'logs'
      ];
  }
  get minTokens (): number {
    return workspace.getConfiguration()
      .get<number>('duplication.minTokens') || 50;
  }
  get maxLines (): number {
    return workspace.getConfiguration()
      .get<number>('duplication.maxLines') || 10000;
  }
  get minLines (): number {
    return workspace.getConfiguration()
      .get<number>('duplication.minLines') || 5;
  }
  get maxSize (): string {
    return workspace.getConfiguration()
      .get<string>('duplication.maxSize') || '100kb';
  }
  get debug (): boolean {
    return workspace.getConfiguration()
      .get<boolean>('duplication.debug') || false;
  }
  get severity (): DiagnosticSeverity {
    return workspace.getConfiguration()
      .get<DiagnosticSeverity>('duplication.severity') || 1;
  }
  get formatsExts (): {
    [key: string]: string[]
  } | {} {
    return workspace.getConfiguration()
      .get<boolean>('duplication.formatsExts') || {};
  }
}