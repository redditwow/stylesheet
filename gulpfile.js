var gulp = require('gulp');
var sass = require('gulp-sass');
var replace = require('gulp-replace');
var spritesmith = require('gulp.spritesmith');
var cleanCSS = require('gulp-clean-css');
var size = require('gulp-size');
var rename = require('gulp-rename');
var fs = require('fs');
var notify = require("gulp-notify");
var insert = require('gulp-insert');
var image = require('gulp-image');
var newer = require('gulp-newer');
var snoowrap = require('snoowrap');
var config = require('./config.json');

if (config.automaticStagingDeployment) {
    var r = new snoowrap({
        userAgent: 'WoW Style Bot by /u/Vusys',
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        username: config.username,
        password: config.password
    });
}

gulp.task('styles', ['sprites', 'sprites-retina', 'flair-link', 'flair-user', 'flair-user-bespoke'], function () {

    var credits = fs.readFileSync('sass/credits.css', 'utf8');
    var herenow = fs.readFileSync('sass/herenow.css', 'utf8');

    devMessage = 'This is not live! Generated on ' + new Date().toUTCString();

    gulp.src('sass/**/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(insert.prepend(herenow))
        .pipe(insert.prepend(credits))
        .pipe(rename('dev.css'))
        .pipe(replace('{{DEV}}', devMessage))
        .pipe(cleanCSS({
            format: 'keep-breaks',
            level: 2
        }))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest('./css'));

    var stream = gulp.src('sass/**/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('prod.css'))
        .pipe(cleanCSS({
            level: {
                2: {all: true}
            }
        }))
        .pipe(replace('../images/background-wow-repeat.jpg', '%%background-wow-repeat%%'))
        .pipe(replace('../images/background-wow-repeat-dark.jpg', '%%background-wow-repeat-dark%%'))
        .pipe(replace('../images/side-divide.fw.png', '%%side-divide%%'))
        .pipe(replace('../images/partyparrot.png', '%%partyparrot%%'))
        // .pipe(replace('../images/sitenav-bar-bg.jpg', '%%sitenav-bar-bg%%'))
        .pipe(replace('../images/background-wow-top.jpg', '%%background-wow-top%%'))
        .pipe(replace('../images/background-wow-top-v2.jpg', '%%background-wow-top-v2%%'))
        .pipe(replace('../images/hero.jpg', '%%hero%%'))

        // Images that need cache busting
        .pipe(replace('../sprites/spritesheet.png', '%%spritesheet-v11%%'))
        .pipe(replace('../sprites/spritesheet-retina-1x.png', '%%spritesheet-retina-1x-v7%%'))
        .pipe(replace('../sprites/spritesheet-retina-2x.png', '%%spritesheet-retina-2x-v7%%'))
        .pipe(replace('../sprites/flair-link.png', '%%flair-link-v3%%'))
        .pipe(replace('../sprites/flair-user-1x.png', '%%flair-user-1x-v11%%'))
        .pipe(replace('../sprites/flair-user-2x.png', '%%flair-user-2x-v11%%'))

        .pipe(replace('../sprites/flair-user-bespoke-1x.png', '%%flair-user-bespoke-1x-v2%%'))
        .pipe(replace('../sprites/flair-user-bespoke-2x.png', '%%flair-user-bespoke-2x-v2%%'))

        .pipe(replace('{{DEV}}', devMessage))
        // reddit doesn't like @charset, so just remove it...
        .pipe(replace('@charset "UTF-8";', ''))

        .pipe(insert.prepend(herenow))
        .pipe(insert.prepend(credits))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest('./css'))
        .on('end', function () {
            if (config.automaticStagingDeployment) {
                r.getSubreddit(config.stagingSubreddit).updateStylesheet({
                    css: fs.readFileSync('./css/prod.css', 'utf8'),
                    reason: 'Updating from dev.'
                });

            }
        });
});

gulp.task('flair-user', function () {
    var spriteData = gulp.src('./flair_user/*.png')
        .pipe(newer('sprites/flair-user-1x.png'))
        .pipe(spritesmith({
            cssName: 'sass/_flair-user.scss',
            retinaSrcFilter: ['./flair_user/*@2x.png'],
            imgName: 'sprites/flair-user-1x.png',
            retinaImgName: './sprites/flair-user-2x.png',
            algorithm: 'binary-tree',
            cssSpritesheetName: 'flair-user',
            cssRetinaGroupsName: 'user-groups',
            cssVarMap: function (sprite) {
                sprite.name = 'flair-' + sprite.name
            }
        }));
    return spriteData.pipe(gulp.dest('.'));
});

gulp.task('flair-user-bespoke', function () {
    var spriteData = gulp.src('./flair_user_bespoke/*.png')
        .pipe(newer('sprites/flair-user-bespoke-1x.png'))
        .pipe(spritesmith({
            cssName: 'sass/_flair-user-bespoke.scss',
            retinaSrcFilter: ['./flair_user_bespoke/*@2x.png'],
            imgName: 'sprites/flair-user-bespoke-1x.png',
            retinaImgName: './sprites/flair-user-bespoke-2x.png',
            algorithm: 'binary-tree',
            cssSpritesheetName: 'flair-user-bespoke',
            cssRetinaGroupsName: 'bespoke-user-groups',
            cssVarMap: function (sprite) {
                sprite.name = 'flair-' + sprite.name
            }
        }));
    return spriteData.pipe(gulp.dest('.'));
});


gulp.task('flair-link', function () {
    var spriteData = gulp.src('./flair_link/*.png')
        .pipe(newer('sprites/flair-link.png'))
        .pipe(spritesmith({
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
    var spriteData = gulp.src('./spritesheet_images/*')
        .pipe(newer('sprites/spritesheet.png'))
        .pipe(spritesmith({
            imgName: 'sprites/spritesheet.png',
            cssName: 'sass/_spritesheet.scss',
            cssSpritesheetName: 'spritesheet',
            algorithm: 'binary-tree'
        }));
    return spriteData.pipe(gulp.dest('.'));
});

gulp.task('sprites-retina', function () {
    var spriteData = gulp.src('./spritesheet_images_retina/*')
        .pipe(newer('sprites/spritesheet-retina-2x.png'))
        .pipe(spritesmith({
            cssName: 'sass/_spritesheet-retina.scss',
            retinaSrcFilter: ['./spritesheet_images_retina/*@2x.png'],
            imgName: 'sprites/spritesheet-retina-1x.png',
            retinaImgName: './sprites/spritesheet-retina-2x.png',
            cssSpritesheetName: 'spritesheet-retina',
            algorithm: 'binary-tree'
        }));
    return spriteData.pipe(gulp.dest('.'));
});

gulp.task('demo', function () {
    var sidebar = fs.readFileSync('demo/content/sidebar.html', 'utf8');
    var snoo = fs.readFileSync('demo/content/header_snoo.html', 'utf8');

    gulp.src('demo/pages/*')
        .pipe(replace('<!--%%sidebar%%-->', sidebar))
        .pipe(replace('<!--%%snoo%%-->', snoo))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest('./demo/'));
});

gulp.task('image', function () {
    gulp.src('./sprites/*')
        .pipe(image())
        .pipe(gulp.dest('./sprites'));
});

//Watch task
gulp.task('default', function () {
    gulp.watch(['sass/**/*.scss', '!sass/**/_*.scss'], ['styles']);
});