
import { ExtensionContext, workspace } from 'vscode';
import { Files, FileData } from './utils/files';
import { Config } from './utils/config';
import { Provider } from './provides/index';
import { detectClones } from './utils/clones';

//设置 文件内容
async function init_file (config: Config): Promise<FileData | undefined> {
  if (!workspace.workspaceFolders) {
    return undefined;
  }
  let root = workspace.workspaceFolders[0].uri.path;
  let f = new Files(root, config);
  let files = await f.exec();
  // let clones = await detectClones('/Users/wangjianliang/Documents/work/trpc-web-utils/protobuf-webpack-plugin/test/index.vue', files, config);
  // let clones = await detectClones('/Users/wangjianliang/Documents/work/trpc-web-utils/protobuf-webpack-plugin/test/ext.vue', files, config);
  // console.log(clones);
  return files;
}
//根目录改变, 配置改变时重新执行
async function onChange (provider: Provider, config: Config) {
  let files = await init_file(config);
  if (!files) {
    provider.stop();
    return;
  };
  provider.set_files(files);
}
// 激活程序
export async function activate (context: ExtensionContext) {
  const config = new Config();
  let files = await init_file(config);
  if (!files) { return; };
  let provider = new Provider(context, files);
  workspace.onDidChangeWorkspaceFolders(() => { onChange(provider, config); });
  workspace.onDidChangeConfiguration(() => { onChange(provider, config); });
}

export function deactivate () { }
