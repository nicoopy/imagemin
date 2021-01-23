module.exports = {
  // origin image directory
  assetsPath: '/opt/hotdoc/imagemin/image',
  // target image directory
  buildPath: '/opt/hotdoc/imagemin/image-min',
  // 200-300kb image quality between 0 and 100
  smallImageQuality: 80,
  // 300-500kb image quality between 0 and 100
  mediumImageQuality: 60,
  // 500-1000kb image quality between 0 and 100
  largeImageQuality: 45,
  // >1000kb image quality between 0 and 100
  extraLargeImageQuality: 38,
  // open lossless compression
  progressive: true,
};
