// require gulp
const gulp = require('gulp');

// require the gulp-sass plugin
const sass = require('gulp-sass');

// require browser sync
const browserSync = require('browser-sync').create();

// require useref
const useref = require('gulp-useref');

// require gulp-unglify and gulp-if
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');

// require cssnano to minify css
const cssnano = require('gulp-cssnano');

// require gulp-imagemin
const imagemin = require('gulp-imagemin');

// require gulp-cache
const cache = require('gulp-cache');

// require del
const del = require('del');

// require run-sequence
const runSequence = require('run-sequence');

// task to compile Sass
gulp.task('sass', function() {
  return gulp
    .src("app/scss/**/*.scss") 
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// task to make live-reload with browser-sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

// task to watch scss changes and reload 
gulp.task('watch', ['browserSync', 'sass', 'lint-css'], function() {
  gulp.watch('app/scss/**/*.scss', [sass]);
  gulp.watch('app/css/*.css', browserSync.reload);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.+[js | jsx]', browserSync.reload);
})

// task to lint css file 
gulp.task('lint-css', function () {
  const gulpStylelint = require('gulp-stylelint');
  return gulp
    .src('app/**/*.css')
    .pipe(gulpStylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    })
  );
});

// useref task
gulp.task('useref', () => {
  return gulp
    .src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// imagemin task
gulp.task('images', () => {
  return gulp
    .src('app/images/**/*.+(png | jpg | gif | svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

// Cleaning 
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// task to build the project for distribution
gulp.task('build', function (callback){
  runSequence('clean:dist',
    ['sass', 'useref', 'images'],
    callback
  )
});

// task to run the project
gulp.task('default', function (callback) {
  runSequence(['sass', 'browserSync', 'watch'], callback)
})