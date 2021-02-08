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
        .pipe(replace('../images/hero-xmas.jpg', '%%hero-xmas%%'))
        .pipe(replace('../images/hero-valentine.jpg', '%%hero-valentine%%'))
        .pipe(replace('../images/hero-valentine-2021.jpg', '%%hero-valentine-2021%%'))
        .pipe(replace('../images/hero-hallowsend-2020.jpg', '%%hero-hallowsend-2020%%'))
        .pipe(replace('../images/hero-shadowlands-v2.jpg', '%%hero-shadowlands-v2%%'))
        .pipe(replace('../images/hero-shadowlands-v3.jpg', '%%hero-shadowlands-v3%%'))
        .pipe(replace('../images/hero-aph.jpg', '%%hero-aph%%'))
        .pipe(replace('../images/partyparrot.png', '%%partyparrot%%'))

        .pipe(replace('../images/artist-1.jpg', '%%artist-1%%'))
        .pipe(replace('../images/artist-1@2x.jpg', '%%artist-1-2x%%'))
        .pipe(replace('../images/artist-2.jpg', '%%artist-2%%'))
        .pipe(replace('../images/artist-2@2x.jpg', '%%artist-2-2x%%'))

        .pipe(replace('../images/artist-1a.jpg', '%%artist-1a%%'))
        .pipe(replace('../images/artist-1a@2x.jpg', '%%artist-1a-2x%%'))
        .pipe(replace('../images/artist-2a.jpg', '%%artist-2a%%'))
        .pipe(replace('../images/artist-2a@2x.jpg', '%%artist-2a-2x%%'))

        .pipe(replace('../images/artist-3.jpg', '%%artist-3%%'))
        .pipe(replace('../images/artist-3@2x.jpg', '%%artist-3-2x%%'))

        .pipe(replace('../images/artist-4.jpg', '%%artist-4%%'))
        .pipe(replace('../images/artist-4@2x.jpg', '%%artist-4-2x%%'))

        .pipe(replace('../images/sl-map.jpg', '%%sl-map%%'))
        .pipe(replace('../images/sl-map@2x.jpg', '%%sl-map-2x%%'))

        .pipe(replace('../images/2m-subs@2x.png', '%%2m-subs-2x%%'))
        .pipe(replace('../images/2m-subs.png', '%%2m-subs%%'))
        .pipe(replace('../images/2m-subs-reverse@2x.png', '%%2m-subs-reverse-2x%%'))
        .pipe(replace('../images/2m-subs-reverse.png', '%%2m-subs-reverse%%'))

        .pipe(replace('../images/x-vusys.png', '%%x-vusys%%'))
        .pipe(replace('../images/x-vusys@2x.png', '%%x-vusys-2x%%'))

        // Reddit aggressively caches images, so all of these images have a version number on the end to bust the cache
        // after changes have been made. This is a manual process :(
        .pipe(replace('../sprites/spritesheet-retina-1x.png', '%%spritesheet-retina-1x-v26%%'))
        .pipe(replace('../sprites/spritesheet-retina-2x.png', '%%spritesheet-retina-2x-v26%%'))

        .pipe(replace('../sprites/spritesheet-snoo-1x.png', '%%spritesheet-snoo-1x-v5%%'))
        .pipe(replace('../sprites/spritesheet-snoo-2x.png', '%%spritesheet-snoo-2x-v5%%'))

        .pipe(replace('../sprites/spritesheet-logo-1x.png', '%%spritesheet-logo-1x-v1%%'))
        .pipe(replace('../sprites/spritesheet-logo-2x.png', '%%spritesheet-logo-2x-v1%%'))

        .pipe(replace('../sprites/flair-user-1x.png', '%%flair-user-1x-v15%%'))
        .pipe(replace('../sprites/flair-user-2x.png', '%%flair-user-2x-v15%%'))

        .pipe(replace('../sprites/flair-user-bespoke-1x.png', '%%flair-user-bespoke-1x-v25%%'))
        .pipe(replace('../sprites/flair-user-bespoke-2x.png', '%%flair-user-bespoke-2x-v25%%'))

        .pipe(replace('{{DEV}}', devMessage))
        // reddit doesn't like @charset, so just remove it...
        .pipe(replace('@charset "UTF-8";', ''))

        .pipe(insert.prepend(herenow))
        .pipe(insert.prepend(credits))
        .pipe(insert.append("\n\n/* Bollocks to Nathanos */"))
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

// gulp.task('sprites-artists', function () {
//     var spriteData = gulp.src('./spritesheet_images/artists/*')
//         .pipe(newer('sprites/spritesheet-artists-2x.png'))
//         .pipe(spritesmith({
//             cssName: 'sass/_spritesheet-artists.scss',
//             retinaSrcFilter: ['./spritesheet_images/artists/*@2x.png'],
//             imgName: 'sprites/spritesheet-artists-1x.png',
//             retinaImgName: './sprites/spritesheet-artists-2x.png',
//             cssSpritesheetName: 'spritesheet-artists',
//             algorithm: 'binary-tree'
//         }));
//     return spriteData.pipe(gulp.dest('.'));
// });


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
        './sprites/*.png',
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