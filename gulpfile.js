var gulp   = require('gulp');
var concat = require('gulp-concat');
var clean  = require('gulp-clean');
var uglify = require('gulp-uglify');
var karma  = require('gulp-karma');
var jshint = require('gulp-jshint');

var srcFiles = [
  './src/angular-lazy-img-logic.js',
  './src/angular-lazy-img-provider.js',
  './src/angular-lazy-img-helpers.js',
  './src/angular-lazy-img-directive.js'
];

gulp.task('clean', function() {
  gulp.src('./release', {read: false})
  .pipe(clean());
});

gulp.task('combine', ['clean'], function() {
  gulp.src(srcFiles)
  .pipe(concat('angular-lazy-img.js'))
  .pipe(gulp.dest('./release/'));
});

gulp.task('minify', ['clean'], function() {
  gulp.src(srcFiles)
  .pipe(concat('angular-lazy-img.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./release/'));
});

gulp.task('default', ['clean', 'combine', 'minify']);


// JSHINT
gulp.task('lint', function() {
  gulp.src('./src/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
  gulp.watch(srcFiles, ['lint']);
});

// TESTS
var testFiles = [
  'bower_components/angular/angular.min.js',
  'bower_components/angular-mocks/angular-mocks.js',
  'tests/*.js',
].concat(srcFiles);

gulp.task('test', ['watch'], function() {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }));
});


