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

gulp.task('js-min', function () {
    log('Minifying JS');

    /*
    return gulp
        .src(config.client + '/dist/main.js')
        .pipe(jsmin())
        .pipe(gulp.dest(config.client + '/dist/'));
    */

    return gulp
        .src('./dist/main.js')
        .pipe(minify({
                compress: false
            })
            .on('error', function(e) {
                console.log(e);
            }))
        .pipe(gulp.dest('./dist/'));

});

// bundle the css in the same order it exists in index.html and copy it to dist
gulp.task('bundlecss', ['sass-min'], function () {
    return gulp.src([
        config.client + '/styles/css/open-sans.css', 
        config.client + '/styles/css/roboto.css', 
        config.client + '/bower_components/font-awesome/css/font-awesome.min.css', 
        config.client + '/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css', 
        config.client + '/bower_components/angular-material/angular-material.min.css', 
        config.client + '/styles/css/ui.css', 
        config.client + '/styles/css/angular-chart.css', 
        config.client + '/styles/css/add-styles.css', 
        config.client + '/styles/css/responsive.css', 
        config.client + '/styles/css/custom.css', 
        config.client + '/bower_components/angularjs-slider/dist/rzslider.css', 
        config.client + '/bower_components/angularjs-datepicker/src/css/angular-datepicker.css', 
        config.client + '/bower_components/summernote/dist/summernote.css', 
        config.client + '/bower_components/nprogress/nprogress.css'])
            .pipe(concat('main.css'))
            .pipe(gulp.dest(config.client + '/dist/'));
});

// bundle the js in the same order it exists in index.html and copy it to dist
gulp.task('bundlejs', function () {
    return gulp.src([config.client + '/index.html'])
        .pipe(gsi())
            .pipe(sourcemaps.init())
                .pipe(concat('main.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.client + '/dist/'));
});

gulp.task('replaceDep', ['getVersion'], function () {
    return gulp.src(config.client + '/index.html')
            .pipe(htmlreplace({
                'js': '/main.js?v=' + version,
                'css': '/main.css?v=' + version            
            }))
            .pipe(gulp.dest(config.client + '/dist/'));
});

gulp.task('replaceVer', ['getVersion'], function () {
    // replace the version in the footer
    gulp.src(config.client + '/app/common/page/html/page.layout.html')
        .pipe(htmlreplace({
            'version': version
        },{
            keepBlockTags: true
        }))
        .pipe(gulp.dest(config.client + '/app/common/page/html/'));

    // replace the version in app.module.js
    gulp.src(config.client + '/app/common/app.module.js')
        .pipe(replace(/var productVersion = '\d{1,9}.\d{1,9}.\d{1,9}';/g, "var productVersion = '" + version + "';"))
        .pipe(gulp.dest(config.client + '/app/common/'));
        
    return true;
});

// copy assets to dist
gulp.task('copyassets', function () {
    log('Copying assets --> /dist');

    // copy images
    gulp.src(config.client + '/images/**')
        .pipe(gulp.dest(config.client + '/dist/images/'));

    // copy inhouse fonts
    gulp.src(config.client + '/fonts/**')
        .pipe(gulp.dest(config.client + '/dist/fonts/'));

    // copy fa fonts
    gulp.src(config.client + '/bower_components/font-awesome/fonts/**')
        .pipe(gulp.dest(config.client + '/dist/fonts/'));

    // copy material-design-iconic-fonts
    gulp.src(config.client + '/bower_components/material-design-iconic-font/dist/fonts/**')
        .pipe(gulp.dest(config.client + '/dist/fonts/'));

    // copy htaccess
    gulp.src(config.client + '/.htaccess')
        .pipe(gulp.dest(config.client + '/dist/'));

    // copy pdf 
    gulp.src(config.client + '/sample-pdf/**')
        .pipe(gulp.dest(config.client + '/dist/sample-pdf/'));

    return true;
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

gulp.task('serve-dist', ['build'], function() {

    apiProxy    = proxy('/oranj', { target: config.apiUrl });
    wsProxy     = proxy('/socket.io', { target: config.socketUrl, ws: true });
    msgProxy    = proxy('/message-api', { target: config.apiUrl });
    adminProxy  = proxy('/admin_tool_dash.html', { target: config.apiUrl });
    msaProxy    = proxy('/msa-app', { target: config.apiUrl }); // not sure that the FE needs this proxy as we never hit a /msa-app/* anywhere in the codebase

    browserSync.init({
        server: config.client + '/dist',
        open: 'external',
        host: config.apiFirm + '.localhost',
        port: 3002,
        ui: {
            port: 3003
        },
        middleware: [apiProxy, wsProxy, msgProxy, adminProxy, msaProxy]
    });

    gulp.watch(config.client + "/styles/sass/*.scss", ['sass']);
    gulp.watch(config.client + "/styles/sass/**/*.scss", ['sass']);

    gulp.watch(config.client + "/**/*.html").on('change', browserSync.reload);
    gulp.watch(config.client + "/app/**/*.html").on('change', browserSync.reload);
    
    gulp.watch(config.client + "/**/*.js").on('change', browserSync.reload);
    gulp.watch(config.client + "/app/**/*.js").on('change', browserSync.reload);
});

gulp.task('getVersion', function (){
    var p = require('./package.json');
    version = p.version;
    return true;
});

gulp.task('build', function(callback) {
    return runSequence('replaceVer',
        ['bundlejs', 'bundlecss'],
        ['copyassets', 'replaceDep'],
        callback);
});

gulp.task('package', function (done) {
    runSequence('build', function () {
        gulp.src(['./dist/**/*.*', './dist/.htaccess'])
            .pipe(zip('reskin.zip'))
            .pipe(gulp.dest('./package/'))
            .on('end', done);
    });
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
