var gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
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
var webp = require('gulp-webp');


if (config.automaticStagingDeployment) {
    var r = new snoowrap({
        userAgent: 'WoW Style Bot by /u/Vusys',
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        username: config.username,
        password: config.password
    });
}

gulp.task('styles', [
    'webp',
], function () {

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
        .pipe(replace('../images/hero-df.jpg', '%%hero-df%%'))
        .pipe(replace('../images/hero-df-new.webp', '%%hero-df-new%%'))
        .pipe(replace('../images/hero-tww.webp', '%%hero-tww%%'))
        .pipe(replace('../images/partyparrot.png', '%%partyparrot%%'))

        .pipe(replace('../images/c-1.jpg', '%%c-1%%'))
        .pipe(replace('../images/c-1-2x.jpg', '%%c-1-2x%%'))
        .pipe(replace('../images/c-2.jpg', '%%c-2%%'))
        .pipe(replace('../images/c-2-2x.jpg', '%%c-2-2x%%'))

        .pipe(replace('../images/c-1a.jpg', '%%c-1a%%'))
        .pipe(replace('../images/c-1a-2x.jpg', '%%c-1a-2x%%'))
        .pipe(replace('../images/c-2a.jpg', '%%c-2a%%'))
        .pipe(replace('../images/c-2a-2x.jpg', '%%c-2a-2x%%'))

        .pipe(replace('../images/c-1.webp', '%%c-1%%'))
        .pipe(replace('../images/c-1-2x.webp', '%%c-1-2x%%'))

        .pipe(replace('../images/c-2.webp', '%%c-2%%'))
        .pipe(replace('../images/c-2-2x.webp', '%%c-2-2x%%'))

        .pipe(replace('../images/c-3.webp', '%%c-3%%'))
        .pipe(replace('../images/c-3-2x.webp', '%%c-3-2x%%'))

        .pipe(replace('../images/c-4.webp', '%%c-4%%'))
        .pipe(replace('../images/c-4-2x.webp', '%%c-4-2x%%'))

        .pipe(replace('../images/sl-map.jpg', '%%sl-map%%'))
        .pipe(replace('../images/sl-map-2x.jpg', '%%sl-map-2x%%'))

        .pipe(replace('../images/2m-subs-2x.png', '%%2m-subs-2x%%'))
        .pipe(replace('../images/2m-subs.png', '%%2m-subs%%'))
        .pipe(replace('../images/2m-subs-reverse-2x.png', '%%2m-subs-reverse-2x%%'))
        .pipe(replace('../images/2m-subs-reverse.png', '%%2m-subs-reverse%%'))

        .pipe(replace('../images/x-vusys.png', '%%x-vusys%%'))
        .pipe(replace('../images/x-vusys-2x.png', '%%x-vusys-2x%%'))

        .pipe(replace('../sprites/sr1x.png', '%%sr1x%%'))
        .pipe(replace('../sprites/sr2x.png', '%%sr2x%%'))

        .pipe(replace('../sprites/spritesheet-snoo-1x.png', '%%spritesheet-snoo-1x%%'))
        .pipe(replace('../sprites/spritesheet-snoo-2x.png', '%%spritesheet-snoo-2x%%'))

        .pipe(replace('../sprites/spritesheet-logo-1x.png', '%%spritesheet-logo-1x%%'))
        .pipe(replace('../sprites/spritesheet-logo-2x.png', '%%spritesheet-logo-2x%%'))

        .pipe(replace('../sprites/fu1x.png', '%%fu1x%%'))
        .pipe(replace('../sprites/fu2x.png', '%%fu2x%%'))

        .pipe(replace('../sprites/fb1x.png', '%%fb1x%%'))
        .pipe(replace('../sprites/fb2x.png', '%%fb2x%%'))

        .pipe(replace('{{DEV}}', devMessage))
        // reddit doesn't like @charset, so just remove it...
        .pipe(replace('@charset "UTF-8";', ''))

        .pipe(insert.prepend(herenow))
        .pipe(insert.prepend(credits))
        // .pipe(insert.append("\n\n/* Bollocks to Nathanos */"))
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
        .pipe(newer('sprites/fu1x.png'))
        .pipe(spritesmith({
            cssName: 'sass/_flair-user.scss',
            retinaSrcFilter: ['./spritesheet_images/flair_user/*@2x.png'],
            imgName: 'sprites/fu1x.png',
            retinaImgName: './sprites/fu2x.png',
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
        .pipe(newer('sprites/fb1x.png'))
        .pipe(spritesmith({
            cssName: 'sass/_flair-user-bespoke.scss',
            retinaSrcFilter: ['./spritesheet_images/flair_user_bespoke/*@2x.png'],
            imgName: 'sprites/fb1x.png',
            retinaImgName: './sprites/fb2x.png',
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
        .pipe(newer('sprites/sr2x.png'))
        .pipe(spritesmith({
            cssName: 'sass/_spritesheet-retina.scss',
            retinaSrcFilter: ['./spritesheet_images/kitchen_sink/*@2x.png'],
            imgName: 'sprites/sr1x.png',
            retinaImgName: './sprites/sr2x.png',
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

gulp.task('sprite-gen', [
    'sprites-retina', 'sprites-snoo', 'sprites-logo',
    'flair-user', 'flair-user-bespoke',
]);

// gulp.task('sprite-optimisation', [
//     'sprites-retina', 'sprites-snoo', 'sprites-logo',
//     'flair-user', 'flair-user-bespoke',
// ]);


gulp.task('webp', ['sprite-gen'], function () {
    gulp.src([
        './sprites/*.png',
        // '!./sprites/*snoo*',
    ])
        .pipe(webp({
            lossless: 0
        }))
        .pipe(gulp.dest('./sprites'));
});

//Watch task
gulp.task('watch', function () {
    gulp.watch(['sass/**/*.scss', '!sass/**/_*.scss'], ['styles']);
});

gulp.task('default', ['styles', 'watch']);