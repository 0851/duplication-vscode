
import * as eventemitter3 from 'eventemitter3';
import { StatusBarItem, window, StatusBarAlignment, ExtensionContext } from 'vscode';
import { LanguageClient } from 'vscode-languageclient';
import { ShowCommand, MainCommand,MainStopCommand } from '../utils/config';
import { IDuplication } from '..';
import { Loading } from '../utils/loading';

export class StatusBar extends eventemitter3 {
  execbar: StatusBarItem;
  resbar: StatusBarItem;
  res: IDuplication[] = [];
  paths: string[] = [];
  loadingtext: string = '重复分析中...';
  constructor (public client: LanguageClient, public context: ExtensionContext, public loading: Loading) {
    super();
    this.execbar = window.createStatusBarItem(StatusBarAlignment.Right, 2);
    this.execbar.text = '检查重复';
    this.execbar.tooltip = '检查重复';
    this.execbar.command = MainCommand;
    this.resbar = window.createStatusBarItem(StatusBarAlignment.Right, 1);
    this.resbar.text = '';
    this.resbar.command = ShowCommand;
    this.resbar.show();
    this.execbar.show();
  }
  async exec () {
    if (this.loading.ing()) {
      this.ing();
      return;
    }
    this.loading.start();
    this.execbar.text = `$(loading~spin)${this.loadingtext}`;
    this.execbar.show();
    this.client.sendNotification(MainCommand);
  }
  async ing () {
    const res = await window.showInformationMessage(this.loadingtext, '终止');
    if (res === '终止') {
      this.client.sendNotification(MainStopCommand);
    }
  }
  changeResult (res: IDuplication[], paths: string[]) {
    if (this.loading.ing()) {
      return;
    }
    this.resbar.text = `${res.length}项重复`;
    this.resbar.tooltip = `${res.length}项重复`;
    this.execbar.text = '重新检查重复';
    this.execbar.tooltip = '重新检查重复';
    this.execbar.show();
    this.execbar.show();
    this.res = res;
    this.paths = paths;
  }
}