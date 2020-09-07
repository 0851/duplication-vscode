
import {
  ExtensionContext, workspace,
  TextDocumentChangeEvent,
  TextEditor,
  window
} from 'vscode';
import { Files, FileData } from './utils/files';
import { Config } from './utils/config';
import { Provider } from './provides/index';
import { QuickPick } from './provides/quickpick';
import { debounce } from './utils';

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});

//设置 文件内容
async function init_file (f: Files, config: Config): Promise<FileData | undefined> {
  if (!workspace.workspaceFolders) {
    return undefined;
  }
  let files = await f.exec();
  return files;
}
//根目录改变, 配置改变时重新执行
async function onChange (f: Files, provider: Provider, config: Config) {
  let files = await init_file(f, config);
  if (!files) {
    provider.stop();
    return;
  };
  provider.set_files(files);
  provider.onChanges();
}
// 激活程序
export async function activate (context: ExtensionContext) {
  const config = new Config();
  let f = new Files(config);
  let files = await init_file(f, config);
  if (!files) { return; };
  let provider = new Provider(context, files, config);
  provider.onChanges();
  context.subscriptions.push(workspace.onDidChangeWorkspaceFolders(debounce(() => { onChange(f, provider, config); })));
  context.subscriptions.push(workspace.onDidChangeConfiguration(debounce(() => { onChange(f, provider, config); })));
  context.subscriptions.push(workspace.onDidChangeTextDocument(
    debounce((event: TextDocumentChangeEvent) => {
      let fp = event.document.uri.path;
      let content = event.document.getText();
      f.put(fp, { content: content });
      provider.onChange(fp);
    })
  ));
  context.subscriptions.push(window.onDidChangeActiveTextEditor(
    debounce((editor: TextEditor | undefined) => {
      if (!editor) {
        return;
      }
      let fp = editor.document.uri.path;
      let content = editor.document.getText();
      f.put(fp, { content: content });
      provider.onChange(fp);
    })
  ));
  QuickPick(context, f, config);
}

export function deactivate () { }
