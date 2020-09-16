
'use strict';

const path = require('path');

const config = {
  target: 'node',
  entry: {
    'extension': './src/extension.ts',
    // "worker": './src/worker.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  devtool: 'source-map',
  externals: {
    "vscode": "vscode",
    "chokidar": "chokidar",
    // "tiny-worker": "tiny-worker",
    // "threads": "threads"
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'eslint-loader',
        options: {
          emitWarning: true, // 这个配置需要打开，才能在控制台输出warning信息
          emitError: true, // 这个配置需要打开，才能在控制台输出error信息
          fix: true // 是否自动修复，如果是，每次保存时会自动修复可以修复的部分
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: ['ts-loader']
      }
    ]
  }
};

module.exports = config;