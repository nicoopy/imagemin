'use strict';

const gulp = require('gulp');
const del = require('del');
const imagemin = require('gulp-imagemin');

const baseConfig = {
  buildPath: './image-min',
  assetsPath: './image',
};
// 方案1:保存以压缩的图片列表，仅对未压缩过的进行压缩

// 压缩图片
gulp.task('imagemin', function() {
  return gulp.src([ `${baseConfig.assetsPath}/**/*` ])
    .pipe(imagemin({
      // progressive: true,
    }))
    .pipe(gulp.dest(`${baseConfig.buildPath}/`));
});
