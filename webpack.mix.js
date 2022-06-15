let mix = require('laravel-mix');

mix.setPublicPath('./')
  .sass('src/assets/scss/app.scss', 'dist/css')
  .js('src/main.js', 'dist').vue()
  .js('src/js/record-page.js', 'dist/js').vue()
  .js('src/js/oauth.js', 'dist/js')
  .js('src/js/api/calendar-api.js', 'dist/js')
  .js('src/js/api/capture-api.js', 'dist/js')
  .copy('src/assets/images/', 'dist/images')
  .copy('src/templates/record-page.html', 'dist')
  .copy('src/templates/app.html', 'dist')
  .copy('src/manifest.json', 'dist')
  .options({
    processCssUrls: false
  });