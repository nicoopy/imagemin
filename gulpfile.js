'use strict';

const gulp = require('gulp');
const baseConfig = require('./config.js');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const fs = require('fs');

const smallImagePathArr = [];
const imageFilePathArr = [];
// var imageFilePathParts = [];
var pointer = 1;
collectImageFilePath(baseConfig.assetsPath);
var imageFilePathParts = batchImageFilePaths(imageFilePathArr, 300);

function collectImageFilePath(assetsPath) {
  if (!assetsPath) {
    throw Error('assetsPath is not defined');
    return;
  }
  if (!/[\/|\\|]/.test(assetsPath.indexOf(assetsPath.length - 1))) {
    assetsPath += '/';
  }
  // console.log('开始扫描目录：' + assetsPath);
  var files = fs.readdirSync(assetsPath) || [];

  for (var i = 0; i < files.length; i += 1) {
    // 检查是否文件夹
    var fileStat = fs.statSync(assetsPath + files[i]);
    var isDirectory = fileStat.isDirectory();
    if (isDirectory) {
      // 递归调用
      collectImageFilePath(assetsPath + files[i]);
    } else if (/\.(jpeg|jpg|png|ico|svg)$/gi.test(files[i])) {
      var filePath = assetsPath + files[i];
      if (fileStat.size / 1024 > 200) {
        imageFilePathArr.push(filePath);
      } else {
        smallImagePathArr.push(filePath);
      }
    }
  }
}

// 根据batchSize，划分图片path列表
function batchImageFilePaths(filePathArr, batchSize) {
  if (!filePathArr) {
    return [];
  }
  var newArr = [];
  var tempArr = []; 
  batchSize = batchSize || 300;
  for(var k = 0; k < filePathArr.length; k += 1) {
    if (k === 0 || k % batchSize !== 0) {
      tempArr.push(filePathArr[k]);
    } else {
      newArr.push(tempArr);
      tempArr = [];
      tempArr.push(filePathArr[k]);
    }
  }
  if (tempArr.length) {
    newArr.push(tempArr);
  }
  return newArr;
}

// 压缩图片，并根据图片文件内容缓存到系统临时文件中
gulp.task('imagemin', function() {
  if (pointer === 0) {
    console.log('\r\n\u001b[32m' + '开始对大于200KB的图片进行分批...' + '\u001b[0m\r\n');
    console.log('\u001b[32m' + '图片将分成' + imageFilePathParts.length + '批进行压缩，并将缓存已压缩图片' + '\u001b[0m\r\n');
  }
  const currentImageFilesPart = imageFilePathParts.shift();
  console.log('\r\n\u001b[32m' + '开始压缩第' + pointer + '批图片：' + '\u001b[0m\r\n');
  pointer += 1;
  
  return gulp.src(currentImageFilesPart)
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({
        quality: baseConfig.imageQuality || 56,  // 质量区间[0,100]
        progressive: baseConfig.imageQuality || true,  // 无损压缩方式，默认true
      }),
      imagemin.optipng({optimizationLevel: 5}),
    ],{
      verbose: true,
      slient: false,
    })))
    .pipe(gulp.dest(`${baseConfig.buildPath}/`))
});

gulp.task('copySmallImage', function() {
  console.log(JSON.stringify(smallImagePathArr, null, 2));
  return gulp.src(smallImagePathArr)
    .pipe(gulp.dest(`${baseConfig.buildPath}/`));
});

// 清除图片缓存
gulp.task('clearCache', function(cb) {
  cache.clearAll();
  cb();
});

gulp.task('imagemin-all', gulp.series(
  'copySmallImage',
  new Array(imageFilePathParts.length).fill('imagemin')
));
