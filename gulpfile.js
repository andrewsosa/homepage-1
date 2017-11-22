const path = require('path')

const gulp    = require('gulp');
const flatten = require('gulp-flatten')

const source = 'src';
const assets = 'assets';
const build = 'build';
const deploy = 'html';

gulp.task('pug', function() {
    const pug    = require('gulp-pug');
    const locals = require('./src/locals.js');

    gulp.src(['src/views/*/*.pug', '!src/views/_includes/**'])
        .pipe(pug({locals: locals}))
        .on('error', console.log)
        .pipe(flatten())
        .pipe(gulp.dest(build));
});

gulp.task('sass', function() {
    const sass = require('gulp-sass');
    const paths = ['src/styles/'];
    gulp.src('src/views/**/*.sass')
        .pipe(sass({includePaths: paths})
            .on('error', sass.logError))
        .pipe(flatten())
        .pipe(gulp.dest(build + '/public/css'));
});

gulp.task('babel', function() {
    const babel = require('gulp-babel');
    return gulp.src('src/js/*.js')
        .pipe(babel())
        .pipe(gulp.dest(build + '/public/js'));
});

gulp.task('favicon', function() {
    gulp.src('public/favicon.png')
        .pipe(gulp.dest(build));
})

gulp.task('assets', ['favicon'], function() {
    gulp.src('assets/img/**')
        .pipe(flatten())
        .pipe(gulp.dest(build + '/public/img'));
});

gulp.task('clean', function() {
    var clean = require('gulp-clean');
    gulp.src(build + '/**', {read:false})
        .pipe(clean());
});

gulp.task('watch', ['build'], function() {
    gulp.watch('src/views/**/*.pug', ['pug']);
    gulp.watch('src/**/events.json', ['pug']);
    gulp.watch('src/**/sponsors.json', ['pug']);
    gulp.watch('src/**/partners.json', ['pug']);
    gulp.watch('src/views/**/*.sass', ['sass']);
    gulp.watch('src/styles/*.sass', ['sass']);
    gulp.watch('public/**', ['assets']);
    gulp.watch('src/locals.js', ['pug'])
});

gulp.task('views', ['pug', 'sass']);
gulp.task('build', ['views', 'assets', 'babel']);
gulp.task('default', ['build']);
