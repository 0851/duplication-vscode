
import {
  createConnection, TextDocuments, ProposedFeatures, TextDocumentSyncKind, Files, ProgressType, FileChangeType
} from 'vscode-languageserver';

import { FileUtil } from './utils/files';
import { Config, StartCommand, Command, ShowCommand, ShowQuickPickCommand, LoadingCommand, LoadingHideCommand } from './utils/config';
import { Provider } from './provides/index';
import debounce from 'lodash-es/debounce';
import { TextDocument } from 'vscode-languageserver-textdocument';
import values from 'lodash-es/values';
const connection = createConnection(ProposedFeatures.all);

const documents = new TextDocuments(TextDocument);

let config: Config;
let files: FileUtil;
let provider: Provider;
let workspaceFolder: string | null;

connection.onInitialize(async (params) => {
  workspaceFolder = params.rootUri;
  if (!workspaceFolder) {
    return {
      capabilities: {}
    };
  }
  config = new Config(connection, Files.uriToFilePath(workspaceFolder || '') || '');
  files = new FileUtil(config);
  await files.exec();
  provider = new Provider(connection, files, config);
  connection.console.log(`[Server(${process.pid}) ${workspaceFolder}] Started and initialize received`);

  let execute = debounce(async () => {
    if (provider.loading > 0) {
      return;
    }
    connection.sendNotification(LoadingCommand);
    await provider.onChanges();
    if (provider.loading <= 0) {
      connection.sendNotification(LoadingHideCommand, [values(provider.diffs)]);
    }
  }, config.debounceWait);


  let changeFn = debounce(async event => {
    let content = event.document.getText();
    let filename = Files.uriToFilePath(event.document.uri || '') || '';
    connection.console.log(`==changed==  ${filename}`);
    await files.put(filename, { content: content });
    provider.onChange(filename);
  }, config.debounceWait);

  connection.onDidChangeWatchedFiles(async _change => {
    let actions = [];
    for (let i = 0; i < _change.changes.length; i++) {
      const change = _change.changes[i];
      let filename = Files.uriToFilePath(change.uri) || '';
      let type = change.type;
      actions.push((async (type, filename) => {
        connection.console.log(`File Changed ${filename} ${type}`);
        await files.update(type, filename);
        provider.fixdiff(type, filename);
      })(type, filename));
    }
    await Promise.all(actions);
  });

  connection.onDidChangeConfiguration(debounce(async () => {
    connection.console.log(`[Server(${process.pid}) ${workspaceFolder}] onDidChangeConfiguration`);
    config && await config.changeConfig();
    await files.exec();
    await execute();
  }, config.debounceWait));



  documents.onDidOpen((event) => {
    connection.console.log(`[Server(${process.pid}) ${workspaceFolder}] Document opened: ${event.document.uri}`);
    changeFn(event);
  });
  documents.onDidChangeContent((event) => {
    connection.console.log(`[Server(${process.pid}) ${workspaceFolder}] Document changed: ${event.document.uri}`);
    changeFn(event);
  });


  connection.onExecuteCommand(async (params) => {
    if (params.command === Command) {
      if (provider.loading > 0) {
        connection.window.showInformationMessage('重复项: 正在分析中...');
        return;
      }
      connection.sendNotification(ShowQuickPickCommand, [values(provider.diffs)]);
    }
  });
  connection.onNotification(StartCommand, async () => {
    if (provider.loading > 0) {
      connection.window.showInformationMessage('重复项: 正在分析中...');
      return;
    }
    await execute();
  });
  connection.onNotification(ShowCommand, async () => {
    if (provider.loading > 0) {
      connection.window.showInformationMessage('重复项: 正在分析中...');
      return;
    }
    connection.sendNotification(ShowQuickPickCommand, [values(provider.diffs)]);
  });
  return {
    capabilities: {
      textDocumentSync: {
        openClose: true,
        change: TextDocumentSyncKind.Full
      },
      executeCommandProvider: {
        commands: [
          Command
        ]
      }
    }
  };
});

documents.listen(connection);
connection.listen();