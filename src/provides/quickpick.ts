import {
  workspace,
  Range,
  Uri,
  window,
  ViewColumn,
  QuickPickItem,
  commands
} from 'vscode';
import { IToken, IDuplication } from '../index.d';
import { removeroot } from '../utils';

// const decoration = window.createTextEditorDecorationType({
//   backgroundColor: "rgba(255,0,0,0.3)"
// });

async function showDiff (a: Omit<IToken, 'content' | 'value'>, b: Omit<IToken, 'content' | 'value'>) {
  let auri = Uri.parse(a.filename);
  let buri = Uri.parse(b.filename);
  let [adocOpen, bdocOpen] = await Promise.all([workspace.openTextDocument(auri), workspace.openTextDocument(buri)]);
  let [adoc, bdoc] = await Promise.all([window.showTextDocument(adocOpen, ViewColumn.One), window.showTextDocument(bdocOpen, ViewColumn.Two)]);

  let arange = new Range(a.start.line - 1, a.start.col - 1, a.end.line - 1, a.end.col - 1);
  let brange = new Range(b.start.line - 1, b.start.col - 1, b.end.line - 1, b.end.col - 1);
  // adoc.setDecorations(decoration, [{
  //   range: arange,
  //   hoverMessage: `Matchs ${a.filename}:${b.filename}`
  // }]);
  // bdoc.setDecorations(decoration, [{
  //   range: brange,
  //   hoverMessage: `Matchs ${b.filename}:${a.filename}`
  // }]);
  adoc.revealRange(arange);
  bdoc.revealRange(brange);
}

export async function quickPick (diff: IDuplication[], root: string) {
  let picks: (QuickPickItem & IDuplication)[] = diff.map((item) => {
    return {
      label: `${removeroot(item.a.filename, root)}:${item.a.start.line} <==> ${removeroot(item.b.filename, root)}:${item.b.start.line}`,
      ...item
    };
  });
  let find = await window.showQuickPick(picks);
  if (!find) {
    return;
  }
  // commands.executeCommand('vscode.diff', Uri.parse(find.a.filename), Uri.parse(find.b.filename), find.label);
  showDiff(find.a, find.b);

}
