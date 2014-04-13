'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');

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
