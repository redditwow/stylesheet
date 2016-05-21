var gulp        = require('gulp');
var sass        = require('gulp-sass');
var replace     = require('gulp-replace');
var spritesmith = require('gulp.spritesmith');
var uglifycss   = require('gulp-uglifycss');
var size        = require('gulp-size');

gulp.task('styles', function () {
	gulp.src('sass/**/main.scss')
		.pipe(sass().on('error', sass.logError))
		// .pipe( replace('http://b.thumbs.redditmedia.com/JMItoXfQe274DPPZxd_MKmLdjT3vRp-7w8wqcN8mV1Y.png', '%%repeat-bg-media%%') )
		// .pipe( replace('http://b.thumbs.redditmedia.com/kBensLEvjkHoegR5JoeIZ5K3PC5X4jS_AZ9zx_4QBkg.png', '%%repeat-bg%%') )
		.pipe(uglifycss({
			maxLineLen: 80,
			uglyComments: true
		}))
		.pipe(size({
			showFiles: true
		}))
		.pipe(gulp.dest('./css/'));
});

gulp.task('sprite', function () {
	var spriteData = gulp.src('./flair/*.png').pipe(spritesmith({
		imgName: 'sprites/sprites.png',
		cssName: 'sass/spritesmith.scss',

		algorithm: 'binary-tree',
		//cssTemplate: 'stylus.template.mustache',
		cssVarMap: function (sprite) {
			sprite.name = 'flair-' + sprite.name
		}
	}));
	return spriteData.pipe(gulp.dest('.'));
});


//Watch task
gulp.task('default', function () {
	gulp.watch('sass/**/*.scss', ['styles']);
});