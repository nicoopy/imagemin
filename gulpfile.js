'use strict';

const gulp = require('gulp');
const baseConfig = require('./config.js');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const fs = require('fs');

const extraSmallImagePathArr = [];
const smallImagePathArr = [];
const mediumImagePathArr = [];
const largeImagePathArr = [];
const extraLargeImagePathArr = [];

var pointer1 = 1;
var pointer2 = 1;
var pointer3 = 1;
var pointer4 = 1;
var pointer5 = 1;

collectImageFilePath(baseConfig.assetsPath);
var extraSmallImageFilePathParts = batchImageFilePaths(extraSmallImagePathArr, 300);
var smallImageFilePathParts = batchImageFilePaths(smallImagePathArr, 300);
var mediumImageFilePathParts = batchImageFilePaths(mediumImagePathArr, 300);
var largeImageFilePathParts = batchImageFilePaths(largeImagePathArr, 300);
var extraLargeImageFilePathParts = batchImageFilePaths(extraLargeImagePathArr, 300);

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
      var filePath = './' + assetsPath.replace(baseConfig.assetsPath, '') + files[i];
      filePath = filePath.replace(/\/\//g, '/');

      var fileSize = fileStat.size / 1024;
      if (fileSize > 1000) {
        extraLargeImagePathArr.push(filePath);
      } else if (fileSize > 500 && fileSize <= 1000) {
        largeImagePathArr.push(filePath)
      } else if (fileSize > 300 && fileSize <= 500) {
        mediumImagePathArr.push(filePath)
      } else if (fileSize > 200 && fileSize <= 300) {
        smallImagePathArr.push(filePath);
      } else {
        extraSmallImagePathArr.push(filePath);
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

// 压缩 <=200k 的图片，并根据图片文件内容缓存到系统临时文件中
gulp.task('imagemin-extraSmall', function() {
  if (pointer1 === 1) {
    console.log('\r\n\u001b[32m' + '开始对小于200k的图片进行分批...' + '\u001b[0m');
    console.log('\u001b[32m' + '图片将分成' + extraSmallImageFilePathParts.length + '批进行拷贝，并将缓存已拷贝图片' + '\u001b[0m');
  }
  const currentImageFilesPart = extraSmallImageFilePathParts.shift();
  console.log('\r\n\u001b[32m' + '开始拷贝第' + pointer1 + '批图片：' + '\u001b[0m\r\n');
  pointer1 += 1;
  
  return gulp.src(currentImageFilesPart, {
      cwd: baseConfig.assetsPath,
      cwdbase: true,
    })
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({
        quality: 100,  // 质量区间[0,100]
        progressive: baseConfig.progressive || true,  // 无损压缩方式，默认true
      }),
      imagemin.optipng({optimizationLevel: 5}),
    ],{
      verbose: true,
      slient: false,
    })))
    .pipe(gulp.dest(`${baseConfig.buildPath}/`))
});
// 压缩 >200k && <= 300k 的图片，并根据图片文件内容缓存到系统临时文件中
gulp.task('imagemin-small', function() {
  if (pointer2 === 1) {
    console.log('\r\n\u001b[32m' + '开始对大于200k小于等于300k的图片进行分批...' + '\u001b[0m');
    console.log('\u001b[32m' + '图片将分成' + smallImageFilePathParts.length + '批进行压缩，并将缓存已压缩图片' + '\u001b[0m');
  }
  const currentImageFilesPart = smallImageFilePathParts.shift();
  console.log('\r\n\u001b[32m' + '开始压缩第' + pointer2 + '批图片：' + '\u001b[0m\r\n');
  pointer2 += 1;
  
  return gulp.src(currentImageFilesPart, {
      cwd: baseConfig.assetsPath,
      cwdbase: true,
    })
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({
        quality: baseConfig.smallImageQuality || 56,  // 质量区间[0,100]
        progressive: baseConfig.progressive || true,  // 无损压缩方式，默认true
      }),
      imagemin.optipng({optimizationLevel: 5}),
    ],{
      verbose: true,
      slient: false,
    })))
    .pipe(gulp.dest(`${baseConfig.buildPath}/`))
});
// 压缩大于300k小于等于500k的图片，并根据图片文件内容缓存到系统临时文件中
gulp.task('imagemin-medium', function() {
  if (pointer3 === 1) {
    console.log('\r\n\u001b[32m' + '开始对大于300k小于等于500k的图片进行分批...' + '\u001b[0m');
    console.log('\u001b[32m' + '图片将分成' + mediumImageFilePathParts.length + '批进行压缩，并将缓存已压缩图片' + '\u001b[0m');
  }
  const currentImageFilesPart = mediumImageFilePathParts.shift();
  console.log('\r\n\u001b[32m' + '开始压缩第' + pointer3 + '批图片：' + '\u001b[0m\r\n');
  pointer3 += 1;
  
  return gulp.src(currentImageFilesPart, {
      cwd: baseConfig.assetsPath,
      cwdbase: true,
    })
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({
        quality: baseConfig.mediumImageQuality || 56,  // 质量区间[0,100]
        progressive: baseConfig.progressive || true,  // 无损压缩方式，默认true
      }),
      imagemin.optipng({optimizationLevel: 5}),
    ],{
      verbose: true,
      slient: false,
    })))
    .pipe(gulp.dest(`${baseConfig.buildPath}/`))
});
// 压缩大于500k小于等于1000k的图片，并根据图片文件内容缓存到系统临时文件中
gulp.task('imagemin-large', function() {
  if (pointer4 === 1) {
    console.log('\r\n\u001b[32m' + '开始对大于500k小于等于1000k的图片进行分批...' + '\u001b[0m');
    console.log('\u001b[32m' + '图片将分成' + largeImageFilePathParts.length + '批进行压缩，并将缓存已压缩图片' + '\u001b[0m');
  }
  const currentImageFilesPart = largeImageFilePathParts.shift();
  console.log('\r\n\u001b[32m' + '开始压缩第' + pointer4 + '批图片：' + '\u001b[0m\r\n');
  pointer4 += 1;
  
  return gulp.src(currentImageFilesPart, {
      cwd: baseConfig.assetsPath,
      cwdbase: true,
    })
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({
        quality: baseConfig.largeImageQuality || 56,  // 质量区间[0,100]
        progressive: baseConfig.progressive || true,  // 无损压缩方式，默认true
      }),
      imagemin.optipng({optimizationLevel: 5}),
    ],{
      verbose: true,
      slient: false,
    })))
    .pipe(gulp.dest(`${baseConfig.buildPath}/`))
});
// 压缩大于1000k图片，并根据图片文件内容缓存到系统临时文件中
gulp.task('imagemin-extraLarge', function() {
  if (pointer5 === 1) {
    console.log('\r\n\u001b[32m' + '开始对大于1000KB的图片进行分批...' + '\u001b[0m');
    console.log('\u001b[32m' + '图片将分成' + extraLargeImageFilePathParts.length + '批进行压缩，并将缓存已压缩图片' + '\u001b[0m');
  }
  const currentImageFilesPart = extraLargeImageFilePathParts.shift();
  console.log('\r\n\u001b[32m' + '开始压缩第' + pointer5 + '批图片：' + '\u001b[0m\r\n');
  pointer5 += 1;
  
  return gulp.src(currentImageFilesPart, {
      cwd: baseConfig.assetsPath,
      cwdbase: true,
    })
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({
        quality: baseConfig.extraLargeImageQuality || 56,  // 质量区间[0,100]
        progressive: baseConfig.progressive || true,  // 无损压缩方式，默认true
      }),
      imagemin.optipng({optimizationLevel: 5}),
    ],{
      verbose: true,
      slient: false,
    })))
    .pipe(gulp.dest(`${baseConfig.buildPath}/`))
});

// 清除图片缓存
gulp.task('clearCache', function(cb) {
  cache.clearAll();
  cb();
});

gulp.task('imagemin-all', gulp.series(
  new Array(extraLargeImageFilePathParts.length).fill('imagemin-extraSmall'),
  new Array(extraLargeImageFilePathParts.length).fill('imagemin-small'),
  new Array(extraLargeImageFilePathParts.length).fill('imagemin-medium'),
  new Array(extraLargeImageFilePathParts.length).fill('imagemin-large'),
  new Array(extraLargeImageFilePathParts.length).fill('imagemin-extraLarge')
));
