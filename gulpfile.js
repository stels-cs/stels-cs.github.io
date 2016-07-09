var gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('connectDev', function () {
    connect.server({
        root: ['./'],
        port: 3000,
        livereload: true,
        https:true
    });
});


gulp.task('default', ['connectDev']);