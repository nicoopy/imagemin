# gulp-imagemin

```bash
$ npm install
$ npm run imagemin
```

### Others

#### problem1: 
```bash
$ phantomjs-prebuilt: Command failed.
```
#### solve: 
```bash
$ npm config set phantomjs_cdnurl=http://cdn.npm.taobao.org/dist/phantomjs_cdnurl
```

#### problem2:
```bash
$ autoreconf: command not found
```
#### solve:
for mac:
```bash
$ brew install libtool automake autoconf nasm
```
for linux:(already install apt-get)
```bash
$ yum install install autoconf automake libtool
```
