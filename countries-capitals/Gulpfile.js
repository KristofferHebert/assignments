var gulp = require('gulp');

var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var clean = require('gulp-clean');

gulp.task('jshint', function () {
    gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('copy-html-files', function () {
    gulp.src(['./app/**/*.html', '!./app/index.html'], {
        base: './app'
    })
        .pipe(gulp.dest('build/'));
});

gulp.task('usemin', function () {
    gulp.src('./app/index.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat', rev()],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('connect', function () {
    connect.server({
        root: 'app/',
        port: 8888
    });
});

gulp.task('connectDist', function () {
    connect.server({
        root: 'build/',
        port: 8090
    });
});

gulp.task('default', ['connectDist']);
gulp.task('build', ['copy-html-files', 'usemin', 'connectDist']);
