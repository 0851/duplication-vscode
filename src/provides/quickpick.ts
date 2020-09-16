import {
  ExtensionContext, workspace,
  Range,
  Uri,
  window,
  commands,
  ViewColumn
} from 'vscode';
import { Files } from '../utils/files';
import { Config } from '../utils/config';
import { Provider } from '../provides/index';
import { IToken } from '../index.d';
import { arrayCombine } from '../utils/combine';
import { dup } from '../utils/duplication';

const decoration = window.createTextEditorDecorationType({
  backgroundColor: "rgba(255,0,0,0.3)"
});

async function showDiff (a: IToken, b: IToken) {
  let auri = Uri.parse(a.filename);
  let buri = Uri.parse(b.filename);
  let [adocOpen, bdocOpen] = await Promise.all([workspace.openTextDocument(auri), workspace.openTextDocument(buri)]);
  let [adoc, bdoc] = await Promise.all([window.showTextDocument(adocOpen, ViewColumn.One), window.showTextDocument(bdocOpen, ViewColumn.Two)]);

  let arange = new Range(a.start.line - 1, a.start.col - 1, a.end.line - 1, a.end.col - 1);
  let brange = new Range(b.start.line - 1, b.start.col - 1, b.end.line - 1, b.end.col - 1);
  adoc.setDecorations(decoration, [{
    range: arange,
    hoverMessage: `Matchs ${a.filename}:${b.filename}`
  }]);
  bdoc.setDecorations(decoration, [{
    range: brange,
    hoverMessage: `Matchs ${b.filename}:${a.filename}`
  }]);
  adoc.revealRange(arange);
  bdoc.revealRange(brange);
}

function removeroot (p: string, root: string | undefined): string {
  if (root === undefined) {
    return p;
  }
  return p.replace(new RegExp(`^${root}/`, 'i'), '');
}
export function QuickPick (context: ExtensionContext, f: Files, provider: Provider, config: Config) {
  context.subscriptions.push(commands.registerCommand('extension.duplication', async () => {
    let p = [...f.paths];
    let combines = arrayCombine(p, 2);
    let diff = dup(combines, f.datas, config.minTokens);
    let picks = diff.map((item) => {
      return {
        label: `${removeroot(item.a.filename, config.root)}:${item.a.start.line} <==> ${removeroot(item.b.filename, config.root)}:${item.b.start.line}`,
        ...item
      };
    });
    let find = await window.showQuickPick(picks);
    if (!find) {
      return;
    }
    showDiff(find.a, find.b);
  }));

}
