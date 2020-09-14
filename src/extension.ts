
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
import { arrayCombine } from './utils';
import { Provider } from './provides/index';
import { QuickPick } from './provides/quickpick';
import debounce from 'lodash-es/debounce';
import { IFileData, IFile, IToken } from './index.d';


// import { spawn, Thread, Worker, Pool } from "threads";
// import * as  os from 'os';
// let size = os.cpus().length || 8;
// let pool = Pool(() => spawn(new Worker("./worker.js")), size);


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
      console.time('time');
      await f.exec();
      console.timeEnd('time');
      if (!f.datas) {
        provider.stop();
        return;
      };
      // console.time("pool");
      // let set = [];
      // Object.keys(f.shingles).forEach((shingle) => {
      //   if (f.shingles[shingle].length > 1) {
      //     set.push(f.shingles[shingle]);
      //   }
      // });
      // console.log(set);
      // console.timeEnd('pool');
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

  console.time('arrayCombine');
  let combines = arrayCombine([...f.paths], 2);
  console.timeEnd('arrayCombine');

  console.log(combines);

  context.subscriptions.push(workspace.onDidChangeWorkspaceFolders(debounce(async () => { await init(f, provider, config); })));
  context.subscriptions.push(workspace.onDidChangeConfiguration(debounce(async () => { await init(f, provider, config); })));

  context.subscriptions.push(workspace.onDidChangeTextDocument(
    debounce(async (event: TextDocumentChangeEvent) => {
      let fp = event.document.uri.path;
      let content = event.document.getText();
      await f.put(fp, { content: content });
      // 性能问题 暂时屏蔽
      // provider.onChange(fp);
    })
  ));

  context.subscriptions.push(window.onDidChangeActiveTextEditor(
    debounce(async (editor: TextEditor | undefined) => {
      if (!editor) {
        return;
      }
      let fp = editor.document.uri.path;
      let content = editor.document.getText();
      await f.put(fp, { content: content });
      // 性能问题 暂时屏蔽
      // provider.onChange(fp);
    })
  ));

  QuickPick(context, f, provider, config);
}

export async function deactivate () {
}
