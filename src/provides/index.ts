import { Files } from '../utils/files';
import { ExtensionContext } from 'vscode';

export class Provider {
  context: ExtensionContext;
  files: Files;
  constructor (context: ExtensionContext, files: Files) {
    this.context = context;
    this.files = files;
  }
  // 重设所有文件内容对象
  set_files (files: Files) {
    this.files = files;
  }
  // 停止比对文件
  stop () {

  }
}