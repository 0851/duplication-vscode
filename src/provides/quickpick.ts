import {
  ExtensionContext, workspace,
  Range,
  Uri,
  window,
  commands,
  ViewColumn,
  QuickPickItem,
  DecorationOptions
} from 'vscode';
import { Files } from '../utils/files';
import { Config } from '../utils/config';
import { Provider } from '../provides/index';
import { detectClones, Duplications, getDuplication, IClone } from '../utils/clones';

// const decoration = window.createTextEditorDecorationType({
//   backgroundColor: "rgba(255,0.0.0.3)"
// });
// function setDecorationOptions (one: Duplications, two: Duplications): DecorationOptions[] {
//   let hoverMessage = `Matchs ${two.source.sourceId}:${two.source.start.line}`;
//   return [];
// }
// async function showDiff (a: Duplications[], b: string) {
// let asource = a[0].source;
// let auri = Uri.parse(asource.sourceId);
// let buri = Uri.parse(b);
// let [adocOpen, bdocOpen] = await Promise.all([workspace.openTextDocument(auri), workspace.openTextDocument(buri)]);
// let [adoc, bdoc] = await Promise.all([window.showTextDocument(adocOpen, ViewColumn.One), window.showTextDocument(bdocOpen, ViewColumn.Two)]);

// let arange = new Range(a.source.start.line, a.source.range[0], a.source.end.line, a.source.range[1]);
// let brange = new Range(b.source.start.line, b.source.range[0], b.source.end.line, b.source.range[1]);
// adoc.setDecorations(decoration, setDecorationOptions(a, b));
// bdoc.setDecorations(decoration, setDecorationOptions(b, a));
// adoc.revealRange(arange);
// bdoc.revealRange(brange);
// }
export function QuickPick (context: ExtensionContext, f: Files, provider: Provider, config: Config) {
  context.subscriptions.push(commands.registerCommand('extension.duplication', async () => {
    let sets = new Set<QuickPickItem>();
    let clones = await f.getClones();
    await provider.onChanges(clones);
    clones.forEach((item) => {
      let keys = [
        item.duplicationA.sourceId,
        item.duplicationB.sourceId
      ];
      keys.sort();
      sets.add({
        label: keys.map(key => key.replace(`${config.root}/` || '', '')).join(` <=> `),
        description: keys.join(` <=> `)
      });
    });
    let find = await window.showQuickPick([...sets]);
    if (!find) {
      return;
    }
    let keys = find.description?.split(' <=> ');
    if (!keys) {
      return;
    }
    let ak = keys[0];
    let bk = keys[1];
    commands.executeCommand('vscode.diff', Uri.parse(ak), Uri.parse(bk), find.label);
    // let a = getDuplication(ak, clones);
    // showDiff(a, bk);
  }));

}
