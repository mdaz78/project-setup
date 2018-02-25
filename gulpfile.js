// require gulp
const gulp = require('gulp');

// require the gulp-sass plugin
const sass = require('gulp-sass');

// require browser sync
const browserSync = require('browser-sync').create();

// require useref
const useref = require('gulp-useref');

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
    .pipe(gulp.dest('dist'))
});