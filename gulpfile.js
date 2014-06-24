var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

var browserify = require('browserify');
var source = require('vinyl-source-stream');

var rimraf = require('rimraf');
var server = require('./server');
var handlebars = require('./libs/handlebars_assets.js');

var paths = {
  scripts: ['app/**/*.js'],
  templates: ['app/**/*.hbs'],
  lessEndPoint: ['app/styles/app.less'],
  lessFiles: ['app/**/*.less']
};

gulp.task('clean-app', function(cb) {
  rimraf('build/**/app.*', cb);
});

gulp.task('clean-build', function(cb) {
  // Needs to be synchronous otherwise getting: ENOTEMPTY
  rimraf.sync('build/js');
  rimraf.sync('build/css');
  cb();
});

gulp.task('lint', function() {
  return gulp.src(paths.scripts).pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  return browserify('./app/src/app.js').transform({
    global: false
  }, handlebars).bundle().pipe(source('app.min.js')).pipe(gulp.dest('build/js'));
});

gulp.task('styles', function() {
  return gulp.src(paths.lessEndPoint).pipe(less()).pipe(minifyCSS()).pipe(rename('app.min.css')).pipe(gulp.dest('build/css'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts.concat(paths.lessFiles).concat(paths.templates), ['lint', 'scripts', 'styles']);
});

gulp.task('server', server.start);

gulp.task('default', ['clean-build', 'scripts', 'styles', 'server', 'watch']);
