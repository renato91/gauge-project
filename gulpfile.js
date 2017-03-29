var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var htmlmin = require('gulp-htmlmin');


var js = [
    'node_modules/angular/angular.min.js',
    'node_modules/chart.js/dist/Chart.min.js',
    'node_modules/angular-chart.js/dist/angular-chart.min.js',
    'assets/app.js',
    'assets/controllers/main.controller.js'
];

gulp.task('compress', function (cb) {
    pump([
        gulp.src(js),
        uglify(),
        gulp.dest('dist/assets')
    ],
        cb
    );
});

gulp.task('minify', function (cb) {
    pump([
        gulp.src('dist/index.html'),
        htmlmin({ collapseWhitespace: true }),
        gulp.dest('dist')
    ],
        cb
    );
});

gulp.task('dist', ['compress', 'minify']);