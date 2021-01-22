'use strict';

const gulp = require('gulp');
const baseConfig = require('./config.js');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');

// 清除图片缓存
gulp.task('clearCache', function(cb) {
  cache.clearAll();
  cb();
});

// 压缩图片，并根据图片文件内容缓存到系统临时文件中
gulp.task('imagemin', function() {

  console.log('\r\n\u001b[32m' + '图片开始进行压缩，并将根据file.contents缓存已压缩图片...' + '\u001b[0m\r\n');

  return gulp.src([ `${baseConfig.assetsPath}/**/*.{jpg,jpeg,svg,png,ico}` ])
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({
        quality: baseConfig.imageQuality || 56,  // 质量区间[0,100]
        progressive: baseConfig.imageQuality || true  // 无损压缩方式，默认true
      }),
      imagemin.optipng({optimizationLevel: 5}),
    ],{
      verbose: true,
      slient: false,
    })))
    .pipe(gulp.dest(`${baseConfig.buildPath}/`));
});
