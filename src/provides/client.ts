
import {
  ExtensionContext,
  window,
  OutputChannel,
  workspace
} from 'vscode';
import { ServerOptions, TransportKind, LanguageClientOptions, LanguageClient } from 'vscode-languageclient';
import {
  ServerId
} from '../utils/config';
import * as path from 'path';

export function createClient (context: ExtensionContext): LanguageClient {
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
      fileEvents: workspace.createFileSystemWatcher('**')
    }
  };

  let client = new LanguageClient(
    ServerId,
    ServerId,
    serverOptions,
    clientOptions
  );

  context.subscriptions.push(client.start());
  return client;
}