import { IDuplication, IToken, IDuplicationToken } from '..';
import * as eventemitter3 from 'eventemitter3';
import {
  window, ExtensionContext,
  TreeDataProvider, TreeItem,
  ProviderResult,
  Event,
  EventEmitter,
  Command,
  Uri,
  TreeItemCollapsibleState,
  workspace
} from 'vscode';
import { LanguageClient } from 'vscode-languageclient';
import { OpenFileCommand } from '../utils/config';
import { Loading } from '../utils/loading';
import { removeRoot } from '../utils';

function getChildrenItem (dups: IDuplication[], root: string = '', filename: string) {
  let res: Item[] = [];
  dups.forEach((item) => {
    let other: IDuplicationToken | undefined;
    let current: IDuplicationToken | undefined;

    if (item.a.filename === filename) {
      other = item.b;
      current = item.a;
    } else if (item.b.filename === filename) {
      other = item.a;
      current = item.b;
    };

    if (other && current) {
      res.push(new Item(
        `${removeRoot(current.filename, root)}:${current.start.line}:${current.end.line}`,
        TreeItemCollapsibleState.None,
        current.filename,
        Uri.parse(current.filename),
        current
      ));
      res.push(new Item(
        `${removeRoot(other.filename, root)}:${other.start.line}:${other.end.line}`,
        TreeItemCollapsibleState.None,
        other.filename,
        Uri.parse(other.filename),
        other,
      ));
    }

  });
  return res;
}
function getItems (dups: IDuplication[], root: string = ''): Item[] {
  let res: Item[] = [];
  let set = new Set<string>();
  dups.forEach((item) => {
    set.add(item.a.filename);
    set.add(item.b.filename);
  });
  res = [...set].map((filename: string) => {
    let items = getChildrenItem(dups, root, filename);
    return new Item(
      `${removeRoot(filename, root)} (${items.length})`,
      TreeItemCollapsibleState.Expanded,
      filename,
      Uri.parse(filename)
    );
  });
  return res;
}
export class NodeDuplicationsProvider implements TreeDataProvider<Item>{
  res: IDuplication[] = [];
  paths: string[] = [];
  constructor (public client: LanguageClient, public context: ExtensionContext,) {
  }
  private _onDidChangeTreeData: EventEmitter<Item | undefined> = new EventEmitter<Item | undefined>();
  readonly onDidChangeTreeData: Event<Item | undefined> = this._onDidChangeTreeData.event;
  refresh (): void {
    this._onDidChangeTreeData.fire(undefined);
  }
  getTreeItem (element: Item): TreeItem {
    return element;
  }
  getChildren (element?: Item): ProviderResult<Item[]> {
    let root = (workspace.workspaceFolders || [])[0]?.uri?.path;
    if (!element) {
      return getItems(this.res, root);
    } else {
      return getChildrenItem(this.res, root, element.value);
    }
  }
}
export class Item extends TreeItem {
  public resourceUri: Uri;
  constructor (
    public label: string,
    public collapsibleState: TreeItemCollapsibleState,
    public value: string,
    public uri: Uri,
    public token?: IDuplicationToken,
    command?: Command
  ) {
    super(label, collapsibleState);
    this.resourceUri = uri;
    this.command = token ? (command || {
      command: OpenFileCommand,
      title: '',
      arguments: [uri, token]
    }) : undefined;
    this.tooltip = value;
  }
}

export class Tree extends eventemitter3 {
  provider: NodeDuplicationsProvider;
  constructor (public client: LanguageClient, public context: ExtensionContext, public loading: Loading) {
    super();
    this.provider = new NodeDuplicationsProvider(client, context);
    window.createTreeView('Duplications.TreeView', {
      treeDataProvider: this.provider
    });
  }
  changeResult (res: IDuplication[], paths: string[]) {
    if (this.loading.ing()) {
      return;
    }
    this.provider.res = res;
    this.provider.paths = paths;
    this.provider.refresh();
  }
}