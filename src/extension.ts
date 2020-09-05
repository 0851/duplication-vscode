
import { ExtensionContext, workspace } from 'vscode';
import { Files } from './utils/files';
import { Config } from './utils/config';
import { Provider } from './provides/index';

//设置 文件内容
function init_file (config: Config): Files | undefined {
  if (!workspace.workspaceFolders) {
    return undefined;
  }
  let root = workspace.workspaceFolders[0].uri.path;
  let files = new Files(root, config.ignore);
  return files;
}
//根目录改变, 配置改变时重新执行
function onChange (provider: Provider, config: Config) {
  let files = init_file(config);
  if (!files) {
    provider.stop();
    return;
  };

  provider.set_files(files);
}
// 激活程序
export function activate (context: ExtensionContext) {
  const config = new Config();
  let files = init_file(config);
  if (!files) { return; };
  let provider = new Provider(context, files);
  workspace.onDidChangeWorkspaceFolders(() => { onChange(provider, config); });
  workspace.onDidChangeConfiguration(() => { onChange(provider, config); });
}

export function deactivate () { }
