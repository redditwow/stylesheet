var gulp        = require('gulp');
var sass        = require('gulp-sass');
var replace     = require('gulp-replace');
var spritesmith = require('gulp.spritesmith');
var uglifycss   = require('gulp-uglifycss');
var size        = require('gulp-size');
var rename      = require('gulp-rename');
var fs          = require('fs');
var notify      = require("gulp-notify");
var insert      = require('gulp-insert');

gulp.task('styles', ['sprites', 'flair-link', 'flair-user'], function () {

	var credits = fs.readFileSync('sass/credits.css', 'utf8');
	var herenow = fs.readFileSync('sass/herenow.css', 'utf8');

	gulp.src('sass/**/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(insert.prepend(herenow))
		.pipe(insert.prepend(credits))
		.pipe(rename('dev.css'))
		.pipe(size({
			showFiles: true
		}))
		.pipe(gulp.dest('./css'));

	gulp.src('sass/**/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(rename('prod.css'))
		.pipe(replace('../images/mini-panel.fw.png', '%%mini-panel%%'))
		.pipe(replace('../images/repeat-bg.jpg', '%%repeat-bg%%'))
		.pipe(replace('../images/repeat-bg-dark.jpg', '%%repeat-bg-dark%%'))
		.pipe(replace('../sprites/spritesheet.png', '%%spritesheet%%'))
		.pipe(replace('../images/header-divide.fw.png', '%%header-divide%%'))
		.pipe(replace('../images/game-icons-50.png', '%%game-icons-50%%'))
		.pipe(replace('../images/section-divider.png', '%%section-divider%%'))
		.pipe(replace('../sprites/flair-link.png', '%%flair-link%%'))
		.pipe(replace('../sprites/flair-user.png', '%%flair-user-v2%%'))
		.pipe(replace('../images/header-illidan-still.jpg', '%%header-illidan-still%%'))
		.pipe(replace('../images/side-divide.fw.png', '%%side-divide%%'))
		.pipe(replace('../images/arrows.png', '%%arrows%%'))
		.pipe(uglifycss({
			maxLineLen: 80,
			uglyComments: true
		}))
		.pipe(insert.prepend(herenow))
		.pipe(insert.prepend(credits))
		.pipe(size({
			showFiles: true
		}))
		.pipe(gulp.dest('./css'));


});

gulp.task('flair-user', function () {
	var spriteData = gulp.src('./flair_user/*.png').pipe(spritesmith({
		imgName: 'sprites/flair-user.png',
		cssName: 'sass/_flair-user.scss',
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
		cssName: 'sass/_flair-link.scss',
		cssSpritesheetName: 'flair-link',
		algorithm: 'binary-tree',
		cssVarMap: function (sprite) {
			sprite.name = 'linkflair-' + sprite.name
		}
	}));
	return spriteData.pipe(gulp.dest('.'));
});


gulp.task('sprites', function () {
	var spriteData = gulp.src('./spritesheet_images/*').pipe(spritesmith({
		imgName: 'sprites/spritesheet.png',
		cssName: 'sass/_spritesheet.scss',
		cssSpritesheetName: 'spritesheet',
		algorithm: 'binary-tree'
	}));
	return spriteData.pipe(gulp.dest('.'));
});

gulp.task('demo', function () {

	var sidebar = fs.readFileSync('demo/content/sidebar.html', 'utf8');
	var snoo    = fs.readFileSync('demo/content/header_snoo.html', 'utf8');

	gulp.src('demo/pages/*')
		.pipe(replace('<!--%%sidebar%%-->', sidebar))
		.pipe(replace('<!--%%snoo%%-->', snoo))
		.pipe(size({
			showFiles: true
		}))
		.pipe(gulp.dest('./demo/'));
});


//Watch task
gulp.task('default', function () {
	gulp.watch('sass/**/*.scss', ['styles']);
});