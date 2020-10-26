import { window, workspace } from 'vscode';
import { debounce } from 'lodash-es';
import { ChangeActiveTextCommand, ExecEndCommand, ChangeResultCommand, DebounceWait } from '../utils/config';
import { IDuplication } from '..';
import { LanguageClient } from 'vscode-languageclient';
import { StatusBar } from './statusbar';
import { Loading } from '../utils/loading';
import { Tree } from './treeview';

export function onEvent (client: LanguageClient, status: StatusBar, tree: Tree, loading: Loading) {
  let debounceWait = workspace.getConfiguration().get<number>("duplication.debounceWait") || DebounceWait;

  window.onDidChangeActiveTextEditor(debounce((event) => {
    client.sendNotification(ChangeActiveTextCommand, [event?.document.uri.path]);
  }, debounceWait));
  workspace.onDidChangeConfiguration(() => {
    let auto = workspace.getConfiguration().get<boolean>("duplication.auto");
    if (auto === true) {
      status.exec();
    }
  });

  client.onNotification(ExecEndCommand, (res: IDuplication[], paths: string[]) => {
    status.end();
    status.changeResult(res, paths);
    tree.changeResult(res, paths);
  });
  client.onNotification(ChangeResultCommand, (res: IDuplication[], paths: string[]) => {
    status.changeResult(res, paths);
    tree.changeResult(res, paths);
  });
}