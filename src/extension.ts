
import {
  ExtensionContext,
  window,
  OutputChannel,
  workspace,
  StatusBarItem,
  StatusBarAlignment,
  commands
} from 'vscode';
import { ServerOptions, TransportKind, LanguageClientOptions, LanguageClient } from 'vscode-languageclient';
import { StartCommand, ServerId, ShowCommand, LoadingHideCommand, LoadingCommand, ShowQuickPickCommand, ChangeActiveTextCommand } from './utils/config';
import * as path from 'path';
import { IDuplication } from '.';
import { quickPick } from './provides/quickpick';
import debounce from 'lodash-es/debounce';

// 关闭最大监听数限制, worker 任务时会超过
process.setMaxListeners(0);
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error);
});


let client: LanguageClient;
let loading = 0;
let myStatusBarItem: StatusBarItem;
let myStatusBarItemExec: StatusBarItem;


function updateStatusBar (res?: any[]) {
  setTimeout(() => {
    if (loading > 0) {
      myStatusBarItem.text = `$(loading~spin) 重复项: 分析中...`;
    } else if (res) {
      myStatusBarItem.text = `重复项: ${res.length}个`;
    } else {
      myStatusBarItem.text = `重复项: 暂未发现`;
    }
    myStatusBarItem.show();
  }, 10);
}
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

  client.onReady().then(() => {
    client.onNotification(LoadingCommand, () => {
      loading++;
      updateStatusBar();
    });
    client.onNotification(LoadingHideCommand, (res: IDuplication[]) => {
      loading--;
      updateStatusBar(res);
    });
    client.onNotification(ShowQuickPickCommand, (res: IDuplication[]) => {
      if (workspace.workspaceFolders) {
        quickPick(res, workspace.workspaceFolders[0].uri.path);
        updateStatusBar(res);
      }
    });
  });

  context.subscriptions.push(
    client.start()
  );

  window.onDidChangeActiveTextEditor(debounce((event) => {
    client.sendNotification(ChangeActiveTextCommand, [event?.document.uri.path]);
  }));

  myStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
  myStatusBarItem.command = ShowCommand;
  myStatusBarItem.show();
  context.subscriptions.push(myStatusBarItem);

  myStatusBarItemExec = window.createStatusBarItem(StatusBarAlignment.Right, 100);
  myStatusBarItemExec.command = StartCommand;
  myStatusBarItemExec.text = `重新检查重复项`;
  myStatusBarItemExec.show();
  context.subscriptions.push(myStatusBarItemExec);

  context.subscriptions.push(commands.registerCommand(StartCommand, () => {
    client.sendNotification(StartCommand);
  }));
  context.subscriptions.push(commands.registerCommand(ShowCommand, () => {
    client.sendNotification(ShowCommand);
  }));
}

export async function deactivate () {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
