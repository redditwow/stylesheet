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

gulp.task('styles', ['sprites-retina', 'sprites-snoo', 'sprites-logo', 'flair-user', 'flair-user-bespoke'], function () {

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

    gulp.src('sass/**/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('prod.css'))
        .pipe(cleanCSS({
            level: {
                2: {all: true}
            }
        }))
        .pipe(replace('../images/bg-repeat-dark.jpg', '%%bg-repeat-dark%%'))
        .pipe(replace('../images/bg-repeat.jpg', '%%bg-repeat%%'))
        .pipe(replace('../images/bg-top.jpg', '%%bg-top%%'))
        .pipe(replace('../images/hero-v2.jpg', '%%hero-v2%%'))
        .pipe(replace('../images/hero-fire.jpg', '%%hero-fire%%'))
        .pipe(replace('../images/partyparrot.png', '%%partyparrot%%'))

        // Reddit aggressively caches images, so all of these images have a version number on the end to bust the cache
        // after changes have been made. This is a manual process :(
        .pipe(replace('../sprites/spritesheet-retina-1x.png', '%%spritesheet-retina-1x-v19%%'))
        .pipe(replace('../sprites/spritesheet-retina-2x.png', '%%spritesheet-retina-2x-v19%%'))

        .pipe(replace('../sprites/spritesheet-snoo-1x.png', '%%spritesheet-snoo-1x-v1%%'))
        .pipe(replace('../sprites/spritesheet-snoo-2x.png', '%%spritesheet-snoo-2x-v1%%'))

        .pipe(replace('../sprites/spritesheet-logo-1x.png', '%%spritesheet-logo-1x-v0%%'))
        .pipe(replace('../sprites/spritesheet-logo-2x.png', '%%spritesheet-logo-2x-v0%%'))

        .pipe(replace('../sprites/flair-user-1x.png', '%%flair-user-1x-v11%%'))
        .pipe(replace('../sprites/flair-user-2x.png', '%%flair-user-2x-v11%%'))

        .pipe(replace('../sprites/flair-user-bespoke-1x.png', '%%flair-user-bespoke-1x-v10%%'))
        .pipe(replace('../sprites/flair-user-bespoke-2x.png', '%%flair-user-bespoke-2x-v10%%'))

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
    var spriteData = gulp.src('./spritesheet_images/flair_user/*.png')
        .pipe(newer('sprites/flair-user-1x.png'))
        .pipe(spritesmith({
            cssName: 'sass/_flair-user.scss',
            retinaSrcFilter: ['./spritesheet_images/flair_user/*@2x.png'],
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
    var spriteData = gulp.src('./spritesheet_images/flair_user_bespoke/*.png')
        .pipe(newer('sprites/flair-user-bespoke-1x.png'))
        .pipe(spritesmith({
            cssName: 'sass/_flair-user-bespoke.scss',
            retinaSrcFilter: ['./spritesheet_images/flair_user_bespoke/*@2x.png'],
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

gulp.task('sprites-retina', function () {
    var spriteData = gulp.src('./spritesheet_images/kitchen_sink/*')
        .pipe(newer('sprites/spritesheet-retina-2x.png'))
        .pipe(spritesmith({
            cssName: 'sass/_spritesheet-retina.scss',
            retinaSrcFilter: ['./spritesheet_images/kitchen_sink/*@2x.png'],
            imgName: 'sprites/spritesheet-retina-1x.png',
            retinaImgName: './sprites/spritesheet-retina-2x.png',
            cssSpritesheetName: 'spritesheet-retina',
            algorithm: 'binary-tree'
        }));
    return spriteData.pipe(gulp.dest('.'));
});


gulp.task('sprites-snoo', function () {
    var spriteData = gulp.src('./spritesheet_images/snoo/*')
        .pipe(newer('sprites/spritesheet-snoo-2x.png'))
        .pipe(spritesmith({
            cssName: 'sass/_spritesheet-snoo.scss',
            retinaSrcFilter: ['./spritesheet_images/snoo/*@2x.png'],
            imgName: 'sprites/spritesheet-snoo-1x.png',
            retinaImgName: './sprites/spritesheet-snoo-2x.png',
            cssSpritesheetName: 'spritesheet-snoo',
            algorithm: 'top-down'
        }));
    return spriteData.pipe(gulp.dest('.'));
});

gulp.task('sprites-logo', function () {
    var spriteData = gulp.src('./spritesheet_images/logo/*')
        .pipe(newer('sprites/spritesheet-logo-2x.png'))
        .pipe(spritesmith({
            cssName: 'sass/_spritesheet-logo.scss',
            retinaSrcFilter: ['./spritesheet_images/logo/*@2x.png'],
            imgName: 'sprites/spritesheet-logo-1x.png',
            retinaImgName: './sprites/spritesheet-logo-2x.png',
            cssSpritesheetName: 'spritesheet-logo',
            algorithm: 'top-down'
        }));
    return spriteData.pipe(gulp.dest('.'));
});

gulp.task('images', ['images-lossless', 'images-lossy']);

gulp.task('images-lossless', function () {
    gulp.src('./sprites/*snoo*')
        .pipe(image({
            // zopflipng: ['-y', '--iterations=15', '--splitting=3', '--filters=01234mepb', '--lossy_8bit', '--lossy_transparent'],
            // zopflipng: ['-y', '-m', '--lossy_8bit', '--lossy_transparent'],
            pngquant: false,
            concurrent: 2,
        }))
        .pipe(gulp.dest('./sprites'));
});

gulp.task('images-lossy', function () {
    gulp.src([
        './sprites/*',
        '!./sprites/*snoo*',
    ])
        .pipe(image({
            concurrent: 2,
            pngquant: ['--speed=1', '--nofs', '--force'],
        }))
        .pipe(gulp.dest('./sprites'));
});

//Watch task
gulp.task('watch', function () {
    gulp.watch(['sass/**/*.scss', '!sass/**/_*.scss'], ['styles']);
});

gulp.task('default', ['styles', 'watch']);