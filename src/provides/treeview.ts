import { IDuplication } from '..';
import * as eventemitter3 from 'eventemitter3';
import {
  StatusBarItem, window, StatusBarAlignment, ExtensionContext,
  TreeDataProvider, TreeItem,
  ProviderResult
} from 'vscode';
import { LanguageClient } from 'vscode-languageclient';
import { ShowCommand, ExecStartCommand, ExecEndCommand, ChangeResultCommand, Command } from '../utils/config';

export class NodeDuplicationsProvider implements TreeDataProvider<Item>{
  getTreeItem (element: Item): TreeItem {
    return element;
  }

  getChildren (element?: Item): ProviderResult<Item[]> {
    return [];
  }
}
export class Item extends TreeItem {

}

export class Tree extends eventemitter3 {
  constructor (public client: LanguageClient, public context: ExtensionContext) {
    super();
    window.registerTreeDataProvider(
      'Duplications.TreeView',
      new NodeDuplicationsProvider()
    );
    window.createTreeView('Duplications.TreeView', {
      treeDataProvider: new NodeDuplicationsProvider()
    });
  }
  changeResult (res: IDuplication[]) {

  }
}