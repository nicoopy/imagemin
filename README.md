# Imagemin by gulp

## Environment
node@latest

## Install
```bash
$ npm install cnpm -g
$ cnpm install
```

## Configure
修改 config.js 文件中的相关配置，修改后需运行npm run clear-cache清除历史图片缓存
+ assetsPath: 原始图片文件路径
+ buildPath: 压缩目标文件路径
+ smallImageQuality: 200-300kb jpeg文件压缩质量, number, [0,100]
+ mediumImageQuality: 300-500kb jpeg文件压缩质量, number, [0,100]
+ largeImageQuality: 500-1000kb jpeg文件压缩质量, number, [0,100]
+ extraLargeImageQuality: >1000kb jpeg文件压缩质量, number, [0,100]
+ progressive: 是否开启无损压缩, boolean, true/false

## Minify images
```bash
$ npm run imagemin
```

## Clear all images cache
```bash
$ npm run clear-cache
```

## Problems:

### problem1:
```bash
$ Error: write callback called multiple times
```
### solve:
主要原因：gulp-imagemin依赖一些第三方工具，需要针对不同系统进行安装：
+ for linux: ( already install apt-get )
  ```bash
  $ yum install autoconf automake libtool nasm
  $ rm -rf node_modules
  $ cnpm install
  ```
+ for mac:
  ```bash
  $ brew install libtool automake autoconf nasm
  $ rm -rf node_modules
  $ cnpm install
  ```
