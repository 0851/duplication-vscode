import { workspace } from 'vscode';
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
    return workspace.getConfiguration('duplication')
      .get<number>('minTokens') || 50;
  }
  get maxLines (): number {
    return workspace.getConfiguration('duplication')
      .get<number>('maxLines') || 10000;
  }
  get minLines (): number {
    return workspace.getConfiguration('duplication')
      .get<number>('minLines') || 5;
  }
  get maxSize (): string {
    return workspace.getConfiguration('duplication')
      .get<string>('maxSize') || '100kb';
  }
  get debug (): boolean {
    return workspace.getConfiguration('duplication')
      .get<boolean>('debug') || false;
  }
  get formatsExts (): {
    [key: string]: string[]
  } | {} {
    return workspace.getConfiguration('duplication')
      .get<boolean>('formatsExts') || {};
  }
}