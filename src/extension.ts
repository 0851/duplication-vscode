
import { ExtensionContext, workspace } from 'vscode';
import { LanguageClient } from 'vscode-languageclient';
import { StatusBar } from './provides/statusbar';
import { Tree } from './provides/treeview';
import { createClient } from './provides/client';
import { Loading } from './utils/loading';
import { registerCommand } from './provides/registerCommand';
import { onEvent } from './provides/onevent';

// 关闭最大监听数限制, worker 任务时会超过
process.setMaxListeners(0);
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error);
});

let client: LanguageClient;

let loading = new Loading();

// 激活程序
export async function activate (context: ExtensionContext) {
  client = createClient(context);
  let status = new StatusBar(client, context, loading);
  let tree = new Tree(client, context, loading);
  await client.onReady();
  let auto = workspace.getConfiguration().get<boolean>("duplication.auto");
  if (auto === true) {
    status.exec();
  }
  onEvent(client, status, tree, loading);
  registerCommand(context, status, loading);
}

export async function deactivate () {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
