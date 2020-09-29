
import * as eventemitter3 from 'eventemitter3';
import { StatusBarItem, window, StatusBarAlignment, ExtensionContext } from 'vscode';
import { LanguageClient } from 'vscode-languageclient';
import { ShowCommand, ExecStartCommand } from '../utils/config';
import { IDuplication } from '..';

export class StatusBar extends eventemitter3 {
  loading: number = 0;
  execbar: StatusBarItem;
  resbar: StatusBarItem;
  res: IDuplication[] = [];
  loadingtext: string = '重复分析中...';
  constructor (public client: LanguageClient, public context: ExtensionContext) {
    super();
    this.execbar = window.createStatusBarItem(StatusBarAlignment.Right, 2);
    this.execbar.text = '检查重复';
    this.execbar.tooltip = '检查重复';
    this.execbar.command = ExecStartCommand;
    this.resbar = window.createStatusBarItem(StatusBarAlignment.Right, 1);
    this.resbar.text = '';
    this.resbar.command = ShowCommand;
    this.resbar.show();
    this.execbar.show();
  }
  async exec () {
    if (this.loading > 0) {
      this.ing();
      return;
    }
    this.loading++;
    this.execbar.text = `$(loading~spin)${this.loadingtext}`;
    this.execbar.show();
    this.client.sendNotification(ExecStartCommand);
  }
  ing () {
    window.showInformationMessage(this.loadingtext);
  }
  changeResult (res: IDuplication[]) {
    if (this.loading > 0) {
      return;
    }
    this.resbar.text = `${res.length}项重复`;
    this.resbar.tooltip = `${res.length}项重复`;
    this.execbar.text = '重新检查重复';
    this.execbar.tooltip = '重新检查重复';
    this.execbar.show();
    this.execbar.show();
    this.res = res;
  }
}