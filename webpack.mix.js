let mix = require('laravel-mix');

mix.setPublicPath('./')
  .sass('src/assets/scss/app.scss', 'dist/css')
  .js('src/main.js', 'dist').vue()
  .js('src/js/oauth.js', 'dist/js')
  .js('src/js/api/calendar-api.js', 'dist/js')
  .js('src/js/api/capture-api.js', 'dist/js')
  .js('src/js/background.js', 'dist/js')
  .copy('src/assets/images/', 'dist/images')
  .options({
    processCssUrls: false
  });