/* jshint -W069, -W079 */

/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 */

'use strict';
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

// Patterns.
var IMAGES_PATTERN = '{jpg,jpeg,gif,png,svg,ico}';
var VIDEOS_PATTERN = '{ogv,mp4}';
var SCRIPTS_PATTERN = 'js';
var SOURCEMAPS_PATTERN = '{css.map,js.map}';
var STYLES_PATTERN = '{css,scss,sass}';
var TEMPLATES_PATTERN = '{html,shtml,htm,html.erb,asp,php,md}';
var DATA_PATTERN = '{json,yml,csv}';
var FONTS_PATTERN = '{eot,svg,ttf,woff,woff2}';
var EXTRAS_PATTERN = 'txt';

// Load modules.
var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var spawn = require('child_process').spawn;
var merge = require('merge-stream');
var sequence = require('run-sequence');
var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

// Environment variables.
var debug = function() { return $.util.env['debug'] || $.util.env['d'] || process.env.GULP_CONFIG_DEBUG; };
var skipImageMin = function() { return $.util.env['skip-imagemin'] || $.util.env['si'] || debug(); };
var skipCSSO = function() { return $.util.env['skip-csso'] || $.util.env['sc'] || debug(); };
var skipUglify = function() { return $.util.env['skip-uglify'] || $.util.env['sj'] || debug(); };
var skipRev = function() { return $.util.env['skip-rev'] || $.util.env['sr'] || debug(); };
var skipMinifyHTML = function() { return $.util.env['skip-minify-html'] || $.util.env['sh'] || debug(); };

/**
 * Runs the Jekyll build task to generate all the templates. These files are generated to the
 * '<%= paths.generated %>' directory. Drafts are automatically built in debug mode.
 *
 * @param {Boolean} --debug Specifies debug environment, builds drafts as well.
 */
gulp.task('generate', function(callback)
{
    var proc;

    if (debug())
    {
        proc = spawn(jekyll, ['build', '--drafts', '--destination=<%= paths.generated %>'], { stdio: 'inherit' });
    }
    else
    {
        proc = spawn(jekyll, ['build', '--destination=<%= paths.generated %>'], { stdio: 'inherit' });
    }

    proc.on('exit', function(code)
    {
        if (code === 0)
        {
            callback();
        }
        else
        {
            return;
        }
    });
});

/**
 * Deploys images to the staging directory.
 *
 * @param {Boolean} --debug         Specifies debug environment, skipping image compression.
 * @param {Boolean} --skip-imagemin Skips image compression.
 */
gulp.task('images', function()
{
    return gulp.src(['<%= paths.generated %>/**/*'+IMAGES_PATTERN])
        .pipe($.if(!skipImageMin(), $.cache($.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{cleanupIDs: false}]
        }))))
        .pipe(gulp.dest('<%= paths.tmp %>'));
});

/**
 * Deploys videos to the staging directory.
 */
gulp.task('videos', function()
{
    return gulp.src(['<%= paths.generated %>/**/*'+VIDEOS_PATTERN])
        .pipe(gulp.dest('<%= paths.tmp %>'));
});

/**
 * Deploys all fonts to the staging directory.
 */
gulp.task('fonts', function()
{
    return gulp.src(['<%= paths.generated %>/assets/**/*.'+FONTS_PATTERN<% if (includeBootstrap) { %>, 'node_modules/bootstrap-sass/assets/**/*.'+FONTS_PATTERN<% } %>])
        .pipe(gulp.dest('<%= paths.tmp %>/assets'));
});

/**
 * Processes all CSS files if preprocessed CSS languages are used (i.e. Stylus, Sass). Deploys the processed
 * files to the staging directory.
 *
 * @param {Boolean} --debug     Specifies debug environment, skipping CSS compression.
 * @param {Boolean} --skip-csso Skips CSS compression.
 */
gulp.task('styles', function()
{
    return merge
    (
        gulp.src('<%= paths.generated %>/assets/css/*.'+STYLES_PATTERN)
            .pipe($.if(debug(), $.sourcemaps.init()))
            .pipe($.sass({
                outputStyle: 'nested',
                precision: 10,
                includePaths: ['.'],
                onError: console.error.bind(console, 'Sass error:')
            }))
            .pipe($.postcss([require('autoprefixer-core')({ browsers: ['last 2 version', 'ie 9'] })]))
            .pipe($.if(!skipCSSO(), $.csso()))
            .pipe($.if(debug(), $.sourcemaps.write()))
            .pipe(gulp.dest('<%= paths.tmp %>/assets/css')),
        gulp.src(['<%= paths.generated %>/assets/vendor/**/*.css'])
            .pipe($.concat('vendor.css'))
            .pipe($.if(!skipCSSO(), $.csso()))
            .pipe(gulp.dest('<%= paths.tmp %>/assets/vendor'))
    ) ;
});

/**
 * Lints and processes all JavaScript files. If Browserify is included this task will bundle up all associated files. Processed
 * JavaScript files deployed to the staging directory.
 *
 * @param {Boolean} --debug         Specifies debug environment, skipping JavaScript compression.
 * @param {Boolean} --skip-uglify   Skips JavaScript compression.
 */
gulp.task('scripts', function()
{
    var browserify = require('browserify');
    var reactify = require('reactify');
    var through = require('through2');

    return merge
    (
        gulp.src(['<%= paths.generated %>/assets/js/*.'+SCRIPTS_PATTERN])
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish'))
            .pipe(through.obj(function(file, enc, next)
            {
                browserify({ entries: [file.path], debug: true, transform: [reactify] })
                    .bundle(function(err, res)
                    {
                        if (err) console.log(err.toString());
                        file.contents = res;
                        next(null, file);
                    });
            }))
            .pipe($.if(debug(), $.sourcemaps.init({ loadMaps: true })))
            .pipe($.if(!skipUglify(), $.uglify())).on('error', $.util.log)
            .pipe($.if(debug(), $.sourcemaps.write('./')))
            .pipe(gulp.dest('<%= paths.tmp %>/assets/js')),
        gulp.src(['<%= paths.generated %>/assets/vendor/**/*.'+SCRIPTS_PATTERN])
            .pipe($.concat('vendor.js'))
            .pipe($.if(!skipUglify(), $.uglify())).on('error', $.util.log)
            .pipe(gulp.dest('<%= paths.tmp %>/assets/vendor'))
    );
});

/**
 * Deploys extra files (i.e. robots.txt).
 */
gulp.task('extras', function()
{
    return gulp.src(['<%= paths.generated %>/**/*.'+EXTRAS_PATTERN])
        .pipe(gulp.dest('<%= paths.tmp %>'));
});

/**
 * Processes all static files (i.e. images, stylesheets, scripts, etc) and deploys them to the staging directory.
 * The staged static files are then deployed to the production directory. Option to append revision hash to the end
 * of the associated file names.
 *
 * @param {Boolean} --debug     Specifies debug environment for immediate and child tasks, skipping revisioning and
 *                              subsequent asset compressions.
 * @param {Boolean} --skip-rev  Skips revisioning.
 */
gulp.task('static', ['images', 'videos', 'fonts', 'styles', 'scripts', 'extras'], function()
{
    return merge
    (
        gulp.src(['<%= paths.tmp %>/**/*.'+EXTRAS_PATTERN])
            .pipe(gulp.dest('<%= paths.build %>')),
        gulp.src(['<%= paths.tmp %>/assets/**/*.'+IMAGES_PATTERN, '<%= paths.tmp %>/assets/**/*.'+VIDEOS_PATTERN, '<%= paths.tmp %>/assets/**/*.'+FONTS_PATTERN, '<%= paths.tmp %>/assets/**/*.'+STYLES_PATTERN, '<%= paths.tmp %>/assets/**/*.'+SCRIPTS_PATTERN])
            .pipe($.if(!skipRev(), $.rev()))
            .pipe(gulp.dest('<%= paths.build %>/assets'))
            .pipe($.size({ title: 'build', gzip: true }))
            .pipe($.if(!skipRev(), $.rev.manifest()))
            .pipe($.if(!skipRev(), gulp.dest('<%= paths.tmp %>'))),
        gulp.src(['<%= paths.tmp %>/*.'+IMAGES_PATTERN, '<%= paths.tmp %>/**/*.'+SOURCEMAPS_PATTERN])
            .pipe(gulp.dest('<%= paths.build %>'))
    );
});

/**
 * Processes all template files (i.e. HTML) and deploys them to the staging and production directory.
 *
 * @param {Boolean} --debug             Specifies debug environment, skipping HTML compression.
 * @param {Boolean} --skip-minify-html  Skips HTML compression.
 */
gulp.task('templates', function(callback)
{
    return gulp.src(['<%= paths.generated %>/**/*.'+TEMPLATES_PATTERN])
            .pipe($.if(!skipMinifyHTML(), $.minifyHtml({empty: true, conditionals: true, loose: true })))
            .pipe(gulp.dest('<%= paths.tmp %>'))
            .pipe(gulp.dest('<%= paths.build %>'));
});

/**
 * Builds the entire project from source directory -> staging directory -> production directory. This includes
 * generating the Jekyll templates, processing static and template files.
 *
 * @param {Boolean} --debug     Specifies debug environment, skipping all sorts of static file compression.
 * @param {Boolean} --skip-rev  Skip replacing embedded file references with revision hash.
 */
gulp.task('build', ['templates', 'static'], function()
{
    if (!skipRev())
    {
        return gulp.src(['<%= paths.build %>/**/*.'+STYLES_PATTERN, '<%= paths.build %>/**/*.'+SCRIPTS_PATTERN, '<%= paths.build %>/**/*.'+TEMPLATES_PATTERN])
            .pipe($.revReplace({ manifest: gulp.src('<%= paths.tmp %>/rev-manifest.json') }))
            .pipe(gulp.dest('<%= paths.build %>'));
    }
    else
    {
        return;
    }
});

/**
 * Cleans the generated, staging and production directories.
 */
gulp.task('clean', function(callback)
{
    require('del')(['<%= paths.generated %>', '<%= paths.tmp %>', '<%= paths.build %>'], function()
    {
        $.cache.clearAll(callback);
    });
});

/**
 * Serves project to localhost and watches for file changes to auto rebuild. Specify debug to build
 * unique static file types separately without any sort of compression. This is recommended during
 * development.
 *
 * @param {Boolean} --debug Serve files from the staging directory (loose files), defaults
 *                          to false (serve from production directory).
 * @param {Number}  --port  Optional port number (defaults to 9000).
 */
gulp.task('serve', function()
{
    var port = $.util.env['port'] || $.util.env['p'];
    var baseDir = (debug()) ? '<%= paths.tmp %>' : '<%= paths.build %>';
    var browserSync = require('browser-sync');

    browserSync(
    {
        notify: false,
        port: (typeof port === 'number') ? port : 9000,
        server:
        {
            baseDir: [baseDir]
        }
    });

    // Watch for changes.
    if (debug())
    {
        gulp.watch('_config.yml', function() { sequence('generate', 'build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+DATA_PATTERN, function() { sequence('generate', 'build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+IMAGES_PATTERN, function() { sequence('generate', 'images', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+VIDEOS_PATTERN, function() { sequence('generate', 'videos', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+STYLES_PATTERN, function() { sequence('generate', 'styles', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+SCRIPTS_PATTERN, function() { sequence('generate', 'scripts', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+TEMPLATES_PATTERN, function() { sequence('generate', 'templates', browserSync.reload); });
    }
    else
    {
        gulp.watch('_config.yml', function() { sequence('generate', 'build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+DATA_PATTERN, function() { sequence('generate', 'build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+IMAGES_PATTERN, function() { sequence('generate', 'build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+VIDEOS_PATTERN, function() { sequence('generate', 'build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+STYLES_PATTERN, function() { sequence('generate', 'build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+SCRIPTS_PATTERN, function() { sequence('generate', 'build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+TEMPLATES_PATTERN, function() { sequence('generate', 'build', browserSync.reload); });
    }
});

/**
 * Default task. Cleans the generated directories and builds the project.
 *
 * @param {Boolean} --debug Specifies debug environment, meaning all sub-tasks will be
 *                          iterated in this environment.
 * @param {Boolean} --serve Specifies whether the site should be served at the end of
 *                          this task.
 */
gulp.task('default', function(callback)
{
    var serve = $.util.env['serve'] || $.util.env['s'];

    var seq = ['clean', 'generate', 'build'];
    if (serve) seq.push('serve');
    seq.push(callback);

    sequence.apply(null, seq);
});
