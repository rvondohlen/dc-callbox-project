// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload');

// Styles
gulp.task('styles', function() {
  return gulp.src('sass/*.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Default task
gulp.task('default', function() {
    gulp.start('styles');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('sass/*.scss', ['styles']);

  // Create LiveReload server
  var server = livereload();

  // Watch any files in dist/, reload on change
   gulp.watch(['css/*.css']).on('change', function(file) {
     server.changed(file.path);
   });

});