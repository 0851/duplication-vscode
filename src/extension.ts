
import {
  ExtensionContext, workspace,
  TextDocumentChangeEvent,
  TextEditor,
  window,
  ProgressLocation,
  CancellationToken
} from 'vscode';
import { Files } from './utils/files';
import { Config } from './utils/config';
import { Provider } from './provides/index';
import { QuickPick } from './provides/quickpick';
import debounce from 'lodash-es/debounce';

// 关闭最大监听数限制, worker 任务时会超过
process.setMaxListeners(0);
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error);
});


//根目录改变, 配置改变时重新执行
async function init (f: Files, provider: Provider, config: Config) {
  if (!workspace.workspaceFolders) {
    return undefined;
  }
  await window.withProgress({
    location: ProgressLocation.Notification,
    title: 'calculate duplication code',
    cancellable: false
  }, async (progress, token: CancellationToken) => {
    try {
      await f.exec();
      if (!f.datas) {
        provider.stop();
        return;
      };
      await provider.onChanges();
    } catch (error) {
      console.error(error);
    }
  });
}


// 激活程序
export async function activate (context: ExtensionContext) {
  const config = new Config();

  const f = new Files(config);

  const provider = new Provider(context, f, config);

  await init(f, provider, config);

  context.subscriptions.push(workspace.onDidChangeWorkspaceFolders(debounce(async () => { await init(f, provider, config); }, config.debounceWait)));
  context.subscriptions.push(workspace.onDidChangeConfiguration(debounce(async () => { await init(f, provider, config); }, config.debounceWait)));

  context.subscriptions.push(workspace.onDidChangeTextDocument(
    debounce(async (event: TextDocumentChangeEvent) => {
      let fp = event.document.uri.path;
      let content = event.document.getText();
      await f.put(fp, { content: content });
      provider.onChange(fp);
    }, config.debounceWait)
  ));

  context.subscriptions.push(window.onDidChangeActiveTextEditor(
    debounce(async (editor: TextEditor | undefined) => {
      if (!editor) {
        return;
      }
      let fp = editor.document.uri.path;
      let content = editor.document.getText();
      await f.put(fp, { content: content });
      provider.onChange(fp);
    }, config.debounceWait)
  ));

  QuickPick(context, f, provider, config);
}

export async function deactivate () {
}
