
import {
  ExtensionContext,
  window,
  OutputChannel,
  workspace,
  commands
} from 'vscode';
import { ServerOptions, TransportKind, LanguageClientOptions, LanguageClient } from 'vscode-languageclient';
import {
  ServerId, ChangeActiveTextCommand, DebounceWait, Command, ExecStartCommand, ShowCommand, ExecEndCommand, ChangeResultCommand
} from './utils/config';
import * as path from 'path';
import { IDuplication } from '.';
import { quickPick } from './provides/quickpick';
import debounce from 'lodash-es/debounce';
import { StatusBar } from './provides/statusbar';
import { Tree } from './provides/treeview';

// 关闭最大监听数限制, worker 任务时会超过
process.setMaxListeners(0);
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error);
});

let client: LanguageClient;

// 激活程序
export async function activate (context: ExtensionContext) {
  let outputChannel: OutputChannel = window.createOutputChannel(ServerId);
  let serverModule = context.asAbsolutePath(path.join('dist', 'server.js'));
  let debugOptions = { execArgv: ["--nolazy", "--inspect=6016"] };
  let serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  let clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: '*' }],
    outputChannel: outputChannel,
    synchronize: {
      configurationSection: 'duplication',
      fileEvents: workspace.createFileSystemWatcher('**/*')
    }
  };

  client = new LanguageClient(
    ServerId,
    ServerId,
    serverOptions,
    clientOptions
  );

  context.subscriptions.push(client.start());

  let status = new StatusBar(client, context);
  let tree = new Tree(client, context);

  let debounceWait = workspace.getConfiguration().get<number>("duplication.debounceWait") || DebounceWait;

  window.onDidChangeActiveTextEditor(debounce((event) => {
    client.sendNotification(ChangeActiveTextCommand, [event?.document.uri.path]);
  }, debounceWait));

  await client.onReady();

  status.exec();

  workspace.onDidChangeConfiguration(() => {
    console.log('===onDidChangeConfiguration===');
    status.exec();
  });
  client.onNotification(ExecEndCommand, (res: IDuplication[]) => {
    status.loading--;
    status.changeResult(res);
    tree.changeResult(res);
  });
  client.onNotification(ChangeResultCommand, (res: IDuplication[]) => {
    status.changeResult(res);
    tree.changeResult(res);
  });

  context.subscriptions.push(commands.registerCommand(Command, () => { status.exec(); }));
  context.subscriptions.push(commands.registerCommand(ExecStartCommand, () => { status.exec(); }));

  context.subscriptions.push(commands.registerCommand(ShowCommand, () => {
    if (status.loading > 0) {
      status.ing();
      return;
    }
    if (status.res.length <= 0) {
      window.showInformationMessage('无重复.');
    }
    if (workspace.workspaceFolders) {
      quickPick(status.res, workspace.workspaceFolders[0].uri.path);
    }
  }));

}

export async function deactivate () {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
