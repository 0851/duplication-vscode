
import {
  createConnection, TextDocuments, ProposedFeatures, TextDocumentSyncKind, Files, FileChangeType,
  DidChangeWatchedFilesParams
} from 'vscode-languageserver';

import { FileUtil } from './utils/files';
import { Config, ExecStartCommand, ExecEndCommand, ChangeActiveTextCommand, ChangeResultCommand } from './utils/config';
import { Provider } from './provides/index';
import debounce from 'lodash-es/debounce';
import { TextDocument } from 'vscode-languageserver-textdocument';
import values from 'lodash-es/values';

const connection = createConnection(ProposedFeatures.all);

const documents = new TextDocuments(TextDocument);

connection.onInitialize(async (params) => {
  let config: Config;
  let files: FileUtil;
  let provider: Provider;
  let workspaceFolder: string | null;

  workspaceFolder = params.rootUri;
  if (!workspaceFolder) {
    return {
      capabilities: {}
    };
  }

  config = new Config(connection, Files.uriToFilePath(workspaceFolder || '') || '');
  files = new FileUtil(config);
  provider = new Provider(connection, files, config);

  connection.console.log(`[Init(${process.pid}) ${workspaceFolder}] Started`);

  connection.onDidChangeWatchedFiles(debounce(async (_change: DidChangeWatchedFilesParams) => {
    let created = _change.changes.findIndex((change) => {
      return change.type === FileChangeType.Created;
    });
    if (created) {
      await files.getpaths();
    }
    for (let i = 0; i < _change.changes.length; i++) {
      const change = _change.changes[i];
      let filename = Files.uriToFilePath(change.uri) || '';
      if (files.paths.includes(filename) !== true) {
        continue;
      }
      let type = change.type;
      connection.console.log(`File Changed ${filename} ${type}`);
      await files.update(type, filename);
      await provider.onChange(filename);
      connection.sendNotification(ChangeResultCommand, [values(provider.diffs)]);
    }
  }, config.debounceWait));

  connection.onNotification(ExecStartCommand, debounce(async () => {
    config && await config.changeConfig();
    await files.exec();
    await provider.onChanges();
    connection.sendNotification(ExecEndCommand, [values(provider.diffs)]);
  }, config.debounceWait));

  let changeFn = async (type: string, filename: string, content?: string) => {
    if (!filename || files.paths.indexOf(filename) < 0) {
      return;
    }
    connection.console.log(`[${type} changeFn(${process.pid}) ${workspaceFolder}] ${filename}`);
    if (content) {
      await files.put(filename, { content: content });
    }
    await provider.onChange(filename);
    connection.sendNotification(ChangeResultCommand, [values(provider.diffs)]);
  };

  documents.onDidChangeContent(debounce(async (event) => {
    let content = event.document.getText();
    let filename = Files.uriToFilePath(event.document.uri || '') || '';
    changeFn('onDidChangeContent', filename, content);
  }, config.debounceWait));

  // 切换tab 触发
  connection.onNotification(ChangeActiveTextCommand, debounce((filename) => {
    changeFn('ChangeActiveTextCommand', filename);
  }, config.debounceWait));

  return {
    capabilities: {
      textDocumentSync: {
        openClose: true,
        change: TextDocumentSyncKind.Full
      }
    }
  };
});

documents.listen(connection);
connection.listen();