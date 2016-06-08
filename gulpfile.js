var gulp        = require('gulp');
var sass        = require('gulp-sass');
var replace     = require('gulp-replace');
var spritesmith = require('gulp.spritesmith');
var uglifycss   = require('gulp-uglifycss');
var size        = require('gulp-size');
var rename      = require('gulp-rename');

gulp.task('styles', ['sprites', 'flair-link', 'flair-user'], function () {
	gulp.src('sass/**/main.scss')
		.pipe(sass().on('error', sass.logError))
		// .pipe( replace('http://b.thumbs.redditmedia.com/JMItoXfQe274DPPZxd_MKmLdjT3vRp-7w8wqcN8mV1Y.png', '%%repeat-bg-media%%') )
		// .pipe( replace('http://b.thumbs.redditmedia.com/kBensLEvjkHoegR5JoeIZ5K3PC5X4jS_AZ9zx_4QBkg.png', '%%repeat-bg%%') )
		//.pipe(uglifycss({
		//	maxLineLen: 80,
		//	uglyComments: true
		//}))
		.pipe(size({
			showFiles: true
		}))
		.pipe(gulp.dest('./css/'));

	gulp.src('sass/**/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(rename('reddit.css'))
		.pipe(replace('../images/mini-panel.fw.png', '%%mini-panel%%'))
		.pipe(replace('../images/repeat-bg.jpg', '%%repeat-bg%%'))
		.pipe(replace('../sprites/spritesheet.png', '%%spritesheet%%'))
		.pipe(replace('../images/header-divide.fw.png', '%%header-divide%%'))
		.pipe(replace('../images/game-icons-50.png', '%%game-icons-50%%'))
		.pipe(replace('../images/section-divider.png', '%%section-divider%%'))
		.pipe(replace('../sprites/flair-link.png', '%%flair-link%%'))
		.pipe(replace('../sprites/flair-user.png', '%%flair-user%%'))
		.pipe(replace('../images/header-illidan-still.jpg', '%%header-illidan-still%%'))
		.pipe(replace('../images/side-divide.fw.png', '%%side-divide%%'))
		.pipe(replace('../images/arrows.png', '%%arrows%%'))
		.pipe(uglifycss({
			maxLineLen: 80,
			uglyComments: true
		}))
		.pipe(size({
			showFiles: true
		}))
		.pipe(gulp.dest('./css/'));
});

gulp.task('flair-user', function () {
	var spriteData = gulp.src('./flair_user/*.png').pipe(spritesmith({
		imgName: 'sprites/flair-user.png',
		cssName: 'sass/flair-user.scss',
		algorithm: 'binary-tree',
		cssSpritesheetName: 'flair-user',
		cssVarMap: function (sprite) {
			sprite.name = 'flair-' + sprite.name
		}
	}));
	return spriteData.pipe(gulp.dest('.'));
});


gulp.task('flair-link', function () {
	var spriteData = gulp.src('./flair_link/*.png').pipe(spritesmith({
		imgName: 'sprites/flair-link.png',
		cssName: 'sass/flair-link.scss',
		cssSpritesheetName: 'flair-link',
		algorithm: 'binary-tree',
		cssVarMap: function (sprite) {
			sprite.name = 'linkflair-' + sprite.name
		}
	}));
	return spriteData.pipe(gulp.dest('.'));
});


gulp.task('sprites', function () {
	var spriteData = gulp.src('./spritesheet_images/*.png').pipe(spritesmith({
		imgName: 'sprites/spritesheet.png',
		cssName: 'sass/spritesheet.scss',
		cssSpritesheetName: 'spritesheet',
		algorithm: 'binary-tree'
	}));
	return spriteData.pipe(gulp.dest('.'));
});


//Watch task
gulp.task('default', function () {
	gulp.watch('sass/**/*.scss', ['styles']);
});