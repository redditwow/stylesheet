var gulp = require('gulp');
var sass = require('gulp-sass');
var replace = require('gulp-replace');

gulp.task('styles', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        // .pipe( replace('http://b.thumbs.redditmedia.com/JMItoXfQe274DPPZxd_MKmLdjT3vRp-7w8wqcN8mV1Y.png', '%%repeat-bg-media%%') )
        // .pipe( replace('http://b.thumbs.redditmedia.com/kBensLEvjkHoegR5JoeIZ5K3PC5X4jS_AZ9zx_4QBkg.png', '%%repeat-bg%%') )
        .pipe(gulp.dest('./css/'));
});

//Watch task
gulp.task('default',function() {
    gulp.watch('sass/**/*.scss',['styles']);
});