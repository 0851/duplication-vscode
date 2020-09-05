import { workspace } from 'vscode';
export class Config {
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
}