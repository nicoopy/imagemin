# Imagemin by gulp

## Environment
node@latest

## Install
```bash
$ npm install cnpm -g
$ cnpm install
```

## Configure
修改 config.js 文件中的相关配置：
+ assetsPath: 原始图片文件路径
+ buildPath: 压缩目标文件路径
+ imageQuality: jpeg文件压缩质量, number, [0,100]
+ progressive: 是否开启无损压缩, boolean, true/false

## Minimize images
```bash
$ npm run imagemin
```

## Clear all images cache
```bash
$ npm run clear-cache
```

## Problems:

### Problem1:
```bash
$ phantomjs-prebuilt: Command failed.
```
### solve: 
```bash
$ npm config set phantomjs_cdnurl=http://cdn.npm.taobao.org/dist/phantomjs_cdnurl
```

### problem2:
```bash
$ autoreconf: Command not found
```
### solve:
for mac:
```bash
$ brew install libtool automake autoconf nasm
```
for linux: ( already install apt-get )
```bash
$ yum install install autoconf automake libtool
```
