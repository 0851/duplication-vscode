import { ExtensionContext, commands, window, workspace, Uri, Range } from 'vscode';
import { MainCommand, TreeRefreshCommand, ShowCommand, OpenFileCommand } from '../utils/config';
import { StatusBar } from './statusbar';
import { Loading } from '../utils/loading';
import { quickPick, openFile } from './quickpick';
import { IDuplicationToken } from '..';

export function registerCommand (context: ExtensionContext, status: StatusBar, loading: Loading) {

  context.subscriptions.push(commands.registerCommand(MainCommand, () => {
    status.exec();
  }));

  context.subscriptions.push(commands.registerCommand(TreeRefreshCommand, () => {
    status.exec();
  }));

  context.subscriptions.push(commands.registerCommand(OpenFileCommand, async ([uri, token]: [Uri, IDuplicationToken]) => {
    openFile(uri, token);
  }));

  context.subscriptions.push(commands.registerCommand(ShowCommand, () => {
    if (loading.ing()) {
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