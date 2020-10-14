import {
  Uri,
  window,
  ViewColumn,
  QuickPickItem,
  workspace,
  Range,
  TextDocumentShowOptions
} from 'vscode';
import { IDuplication, IDuplicationToken } from '../index.d';
import { removeRoot } from '../utils';

export async function openFile (uri: Uri, token?: IDuplicationToken, options?: TextDocumentShowOptions) {
  let opened = await workspace.openTextDocument(uri);
  let doc = await window.showTextDocument(opened, {
    preview: false,
    ...options
  });
  if (token) {
    let range = new Range(token.start.line - 1, token.start.col - 1, token.end.line - 1, token.end.col - 1);
    doc.revealRange(range);
  }
  return doc;
}

async function showDiff (a: IDuplicationToken, b: IDuplicationToken) {
  let auri = Uri.parse(a.filename);
  let buri = Uri.parse(b.filename);
  let [adoc, bdoc] = await Promise.all([
    openFile(auri, a, {
      viewColumn: ViewColumn.One,
    }),
    openFile(buri, b, {
      viewColumn: ViewColumn.Two,
    })
  ]);
  // const decoration = window.createTextEditorDecorationType({
  //   backgroundColor: "rgba(255,0,0,0.3)"
  // });
  // adoc.setDecorations(decoration, [{
  //   range: arange,
  //   hoverMessage: `Matchs ${a.filename}:${b.filename}`
  // }]);
  // bdoc.setDecorations(decoration, [{
  //   range: brange,
  //   hoverMessage: `Matchs ${b.filename}:${a.filename}`
  // }]);
}

export async function quickPick (diff: IDuplication[], root: string) {
  let picks: (QuickPickItem & IDuplication)[] = diff.map((item) => {
    return {
      label: `${removeRoot(item.a.filename, root)}:${item.a.start.line} <==> ${removeRoot(item.b.filename, root)}:${item.b.start.line}`,
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
