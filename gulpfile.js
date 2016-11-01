/*
 ---------------------------------------------
 version: 1.0.3
 author: Luke Deylen (luke.deylen@clemenger.com.au)


----- Commands -----

gulp build          -- For Google Standard and Generic Banner Build
    Options         - s(Sizmek) d(Default/Doubleclick)
                    - #Number of loops
                    - String to append to folder names

gulp build-common   -- Builds a loop and noLoop version of all the banners
    Options         - s(Sizmek) d(Default/Doubleclick)

--------------------

 ---------------------------------------------
 */


//External Libraries
var gulp = require('gulp');
var del = require('del');
var fs = require('fs');
var path = require('path');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var purify = require('gulp-purifycss');
var minifyCss = require('gulp-minify-css');
var merge = require('merge-stream');
var htmlreplace = require('gulp-html-replace');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var autoprefixer = require('gulp-autoprefixer');
var prompt = require('gulp-prompt');
var zip = require('gulp-zip');
var swiffyBanner = require('gulp-swiffy-banner');

//Local Libraries
var cacheKill = require('./lib/gulp-cachekill');




/* ---- EDITABLE VARIABLES ----- */

var STANDARD_SOURCE_PATH = "./Standard/src/";
var STANDARD_BUILD_PATH = "./Standard/build/";
var STANDARD_DISPATCH_PATH = "./Standard/dispatch/";

var SWIFFY_SOURCE_PATH = "./Swiffy/src/";
var SWIFFY_BUILD_PATH = "./Swiffy/build/";

/* ---- TASK VARIABLES ----- */

var publishType = "google";
var totalLoops = 0;
var appendFolders = "";

var cacheBuster;


/* ---- GET FOLDER NAMES ----- */

var folders = [];




/*
    Deletes all in build folders
*/
gulp.task('standard-clean', function (cb) {
    del([STANDARD_BUILD_PATH+'**/*', STANDARD_DISPATCH_PATH+'**/*'], cb);
});

gulp.task('swiffy-clean', function (cb) {
    del([SWIFFY_BUILD_PATH+'**/*'], cb);
});


/*
    CSS Processing
    Standard - Combined all into all.css, purify it against the javascript and html, autoprefixes the css for supported browsers, minify the css, create new version in build.
 */

gulp.task('standard-css', function(){
    var tasks = folders.map(function(element){
        return gulp.src(STANDARD_SOURCE_PATH+element+'/css/**/*.css')
            .pipe(concat('all.css'))
            .pipe(purify([STANDARD_SOURCE_PATH+element+'/**/*.js', STANDARD_SOURCE_PATH+element+'/**/*.html']))
            .pipe(autoprefixer({
                browsers: ['Firefox >= 38', 'ie >= 9', "Safari >= 5", "Chrome >= 40", "Opera >= 29"],
                cascade: false
            }))
            .pipe(minifyCss({compatibility: 'ie9'}))
            .pipe(gulp.dest(STANDARD_BUILD_PATH+element+appendFolders+'/css/'));
    });

    return merge(tasks);
});


/*
    JavaScript Processing
    Standard - Combined all into all.js, uglify the js, create new version in build.
 */

gulp.task('standard-js', function(){
    var tasks = folders.map(function(element){
        return gulp.src(STANDARD_SOURCE_PATH+element+'/js/**/*.js')
            .pipe(concat('all.js'))
            .pipe(uglify())
            .pipe(gulp.dest(STANDARD_BUILD_PATH+element+appendFolders+'/js/'));
    });

    return merge(tasks);
});


/*
    HTML Processing
    Standard
        - Removes references to all css and javascript and updates with optimised paths.
        - Based on build type ads Generic (Google) or Sizmek Clicktags.

    *HTML File must be setup with comments in the example for this to work.

 */

gulp.task('standard-html', function () {
    var jsCode = googleJS;
    var publishCode = googlePublish;
    if(publishType === "sizmek"){
        jsCode = sizmekJS;
        publishCode = sizmekPublish;
    }
    jsCode += "<script type='application/javascript' src='js/all.js?cache="+cacheBuster+"'></script>";

    var initCode = getLoopScript();
    var tasks = folders.map(function(element) {
        return gulp.src(STANDARD_SOURCE_PATH+element+'/index.html')
            .pipe(htmlreplace({
                'css': 'css/all.css?cache='+cacheBuster,
                'js': {
                    src: null,
                    tpl: jsCode
                },
                'init': {
                    src: null,
                    tpl: initCode
                },
                'publish': {
                    src: null,
                    tpl: publishCode
                }
            }))
            .pipe(cacheKill.bust(cacheBuster))
            .pipe(gulp.dest(STANDARD_BUILD_PATH+element+appendFolders));
    });

    return merge(tasks);
});



/*
    Image Processing
    Standard - Gets all the images in the img folder and optomises. PNG compression can be manually done to further improve as this algorithm only takes images down to approxametly 128bits of colour.
 */

gulp.task('standard-images', function () {
    var tasks = folders.map(function (element) {
        return gulp.src(STANDARD_SOURCE_PATH+element+'/imgs/*')
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            }))
            .pipe(gulp.dest(STANDARD_BUILD_PATH+element+appendFolders+'/imgs/'));
    });

    return merge(tasks);
});

gulp.task('move-backups', function(cb) {

    var tasks = folders.map(function(element){
        return gulp.src([STANDARD_SOURCE_PATH+element+'/*.gif', STANDARD_SOURCE_PATH+element+'/*.jpg'])
            .pipe(gulp.dest(STANDARD_BUILD_PATH+element+appendFolders));
    });
    return merge(tasks);

});

/*

 Package Processing

 */
gulp.task('standard-package', function () {
    var tasks = folders.map(function (element) {
        return gulp.src(STANDARD_BUILD_PATH+element+appendFolders+"/**/*")
            .pipe(zip(element+appendFolders+'.zip'))
            .pipe(gulp.dest(STANDARD_DISPATCH_PATH));
    });

    return merge(tasks);
});

/*
    Creates a directory index.html file at the root of the Standard folder to allow easy navigation of multiple content. This will be made redundant on the completion of Creative Manager.
*/
gulp.task('directory', function () {
    var html = "";
    var foldersLength = folders.length;
    for(var i=0; i<foldersLength; i++){
        //html += "<li><a href='"+folders[i]+appendFolders+"/index.html?cache="+cacheBuster+"'>"+folders[i]+"</a></li>";
        html += "<option value='"+folders[i]+appendFolders+"'>"+folders[i]+appendFolders+"</option>";
    }

    return gulp.src(STANDARD_SOURCE_PATH+'index.html')
        .pipe(htmlreplace({
            'list': html,
        }))
        .pipe(gulp.dest(STANDARD_BUILD_PATH));

});


/* Prompts */

gulp.task('prompt-publisher', function () {
    return gulp.src(STANDARD_SOURCE_PATH+'index.html')
        .pipe(prompt.prompt({
            type: 'input',
            name: 'publisher',
            message: 'Please select the Clicktags Type: s (Sizmek) or d (Default/Doubleclick Standard)',
        }, function(res) {
            var answer = res.publisher;
            if(answer === "s"){
                publishType = 'sizmek';
                console.log("Building for Sizmek");
            } else if(answer === "d"){
                publishType = 'google';
                console.log("Building for Default or Doubleclick Standard");
            } else {
                console.log("Invalid publisher entered. Default Selected");
                publishType = 'google';
            }

        }))
});

gulp.task('prompt-loops', function () {

    return gulp.src(STANDARD_SOURCE_PATH+'index.html')
        .pipe(prompt.prompt({
            type: 'input',
            name: 'loops',
            message: 'Please enter the total number of loops. 0 = unlimited',
        }, function(res) {
            var answer = res.loops;
            if(isNaN(answer) || answer === ""){
                totalLoops = 0;
                console.log("Invalid loops entered. Set to unlimited loops");
            } else {
                totalLoops = answer;
                console.log("Loops set to "+totalLoops);
            }
        }))
});

gulp.task('prompt-append-folders', function () {
    return gulp.src(STANDARD_SOURCE_PATH+'index.html')
        .pipe(prompt.prompt({
            type: 'input',
            name: 'append',
            message: 'What would you like to append to the folder name?',
        }, function(res) {
            var answer = res.append;
            appendFolders = "";
            if(answer === ""){
                console.log("Nothing appended to folder name");
            } else {
                appendFolders = answer;
                console.log(appendFolders+ " will be appended to all the folders.");
            }

        }))
});


/*
    SWIFFY CLASS
 */


gulp.task('swiffy-add-tags', function () {
    var tasks;
    if(publishType === "sizmek"){
        tasks = folders.map(function(element) {
            return gulp.src(SWIFFY_SOURCE_PATH+element)
                .pipe(swiffyBanner.sizmek())
                .pipe(gulp.dest(SWIFFY_BUILD_PATH));
        });
    } else {
        tasks = folders.map(function(element) {
            return gulp.src(SWIFFY_SOURCE_PATH+element)
                .pipe(swiffyBanner.google())
                .pipe(gulp.dest(SWIFFY_BUILD_PATH));
        });
    }
    return merge(tasks);
});


/*
     Core tasks names

*/


gulp.task('build', function (callback){
    runSequence (
        'get-standard-folders',
        'prompt-publisher',
        'prompt-loops',
        'prompt-append-folders',
        'standard-clean',
        'set-cache-buster',
        ['standard-css', 'standard-js', 'standard-html', 'standard-images', 'directory', 'move-backups'],
        'standard-package',
        callback
    );

});

gulp.task('build-common', function (callback){
    runSequence (
        'get-standard-folders',
        'prompt-publisher',
        'standard-clean',
        'set-cache-buster',
        'set-loops',
        ['standard-css', 'standard-js', 'standard-html', 'standard-images', 'move-backups'],
        'standard-package',
        'set-noloop',
        ['standard-css', 'standard-js', 'standard-html', 'standard-images', 'move-backups'],
        'standard-package',

        callback
    );

});

gulp.task('build-swiffy', function (callback){
    runSequence (
        'get-swiffy-folders',
        'prompt-publisher',
        'swiffy-clean',
        'swiffy-add-tags',
        callback
    );

});


/* ------- CHANGE VAR TASKS -------- */


gulp.task('set-cache-buster', function () {
    var date = new Date();
    cacheBuster = date.getFullYear()+""+date.getMonth()+""+date.getDate()+""+date.getHours()+""+date.getMinutes()+""+date.getSeconds()+""+date.getMilliseconds();
});

gulp.task('set-loops', function () {
    totalLoops = 0;
    appendFolders = "_loops";
});

gulp.task('set-noloop', function () {
    totalLoops = 1;
    appendFolders = "_noLoop";
});

gulp.task('get-standard-folders', function () {
    fs.readdirSync(STANDARD_SOURCE_PATH).map(function(folderNames) {
        if (fs.statSync(path.join(STANDARD_SOURCE_PATH, folderNames)).isDirectory()) {
            folders.push(folderNames);
            console.log("Folder Names - "+folderNames);
        }
    });
});

gulp.task('get-swiffy-folders', function () {
    fs.readdirSync(SWIFFY_SOURCE_PATH).map(function(swiffyName) {
        if (fs.statSync(path.join(SWIFFY_SOURCE_PATH, swiffyName))) {
            folders.push(swiffyName);
            console.log("SWIFFY Names - "+swiffyName);
        }
    });
});

/* ------- FUNCTIONS FOR TASKS TO USE ------- */

function getLoopScript(){
    return '<script>var clm = new CLM('+totalLoops+');</script>';
}


/* ------- VARS OF CODE THAT TASKS USE -------- */

var sizmekJS = '<script type="application/javascript" src="https://secure-ds.serving-sys.com/BurstingScript/EBLoader.js"></script>';
var googleJS = '<script>var clickTag = "";</script>';
var sizmekPublish = "<script>function checkInit() {if (!EB.isInitialized()) {EB.addEventListener(EBG.EventName.EB_INITIALIZED, startAnimation);} else {startAnimation()}}function triggerClickthrough(){EB.clickthrough()}</script>";
var googlePublish = "<script>function checkInit() {startAnimation();}function triggerClickthrough(){window.open(clickTag, '_blank');}</script>";