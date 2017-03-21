var gulp            = require('gulp');
var args            = require('yargs').argv;
var del             = require('del');
var $               = require('gulp-load-plugins')({lazy: true});
var karmaServer     = require('karma').Server;
var proxy           = require('http-proxy-middleware'),
    htmlhint        = require("gulp-htmlhint"),
    zip             = require('gulp-vinyl-zip').zip,
    htmlmin         = require('htmlmin'),
    path            = require('path');
var apiProxy;
var browserSync     = require('browser-sync').create();
var concat          = require('gulp-concat');
var sourcemaps      = require('gulp-sourcemaps');
var gsi             = require('gulp-scripts-index');
var htmlreplace     = require('gulp-html-replace');
var runSequence     = require('run-sequence');
var templateCache   = require('gulp-angular-templatecache');
var version         = 'x.x.x';
var replace         = require('gulp-replace');
var jsmin           = require('gulp-jsmin');
var minify          = require('gulp-minify');

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('sass', function () {
    log('Compiling Sass --> CSS');

    var sassOptions = {
        outputStyle: 'nested' // nested, expanded, compact, compressed
    };

    return gulp
        .src('./styles/sass/*.scss')
        .pipe($.plumber({errorHandler: swallowError}))
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions))
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write())
        //.pipe(gulp.dest(config.tmp + '/styles'));
        .pipe(gulp.dest('./styles/css'))
        .pipe(browserSync.stream());
});

gulp.task('sass-min', function () {
    log('Compiling & Minifying Sass --> CSS');

    var sassOptions = {
        outputStyle: 'compressed' // nested, expanded, compact, compressed
    };

    return gulp
        .src('./styles/sass/*.scss')
        .pipe($.plumber({errorHandler: swallowError}))
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions))
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write())
        //.pipe(gulp.dest(config.tmp + '/styles'));
        .pipe(gulp.dest('./styles/css'))
        .pipe(browserSync.stream());
});


gulp.task('serve', ['sass'], function() {

    //apiProxy    = proxy('/oranj', { target: config.apiUrl });
    //wsProxy     = proxy('/socket.io', { target: config.socketUrl, ws: true });
    //msgProxy    = proxy('/message-api', { target: config.apiUrl });
    //adminProxy  = proxy('/admin_tool_dash.html', { target: config.apiUrl });
    //msaProxy    = proxy('/msa-app', { target: config.apiUrl }); // not sure that the FE needs this proxy as we never hit a /msa-app/* anywhere in the codebase

    browserSync.init({
        server: './',
        open: 'external',
        host: 'karl.localhost',
        port: 3006,
        ui: {
            port: 3007
        }//,
        //middleware: [apiProxy, wsProxy, msgProxy, adminProxy, msaProxy]
    });

    gulp.watch("./styles/sass/*.scss", ['sass']);
    gulp.watch("./styles/sass/**/*.scss", ['sass']);

    gulp.watch("./*.html").on('change', browserSync.reload);
    
    //gulp.watch(config.client + "/**/*.js").on('change', browserSync.reload);
    //gulp.watch(config.client + "/app/**/*.js").on('change', browserSync.reload);
});

gulp.task('getVersion', function (){
    var p = require('./package.json');
    version = p.version;
    return true;
});

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.green(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.green(msg));
    }
}

function swallowError(error) {
    // If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}
