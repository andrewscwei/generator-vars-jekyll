/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Compiles all stylesheets and deploys them to the /<%= paths.tmp %> directory.
 *
 *  @param {Boolean} debug
 *  @param {Boolean} skip-csso
 */

var autoprefixer = require('autoprefixer-core');
var config = require('./config');
var gulp = require('gulp');
var merge = require('merge-stream');
var $concat = require('gulp-concat');
var $csso = require('gulp-csso');
var $if = require('gulp-if');
var $postcss = require('gulp-postcss');
var $sass = require('gulp-sass');
var $sourcemaps = require('gulp-sourcemaps');
var $util = require('gulp-util');

gulp.task('styles', function()
{
    return merge
    (
        gulp.src(config.paths.generated+'/assets/css/*.'+config.patterns.styles)
            .pipe($if(config.env.debug, $sourcemaps.init()))
            .pipe($sass({
                outputStyle: 'nested',
                includePaths: ['node_modules', config.paths.generated+'/assets/css']
            })
                .on('error', function(err)
                {
                  $util.log($util.colors.red('Sass error: ' + err.message));
                  this.emit('end');
                }))
            .pipe($postcss([autoprefixer({ browsers: ['last 2 version', 'ie 9'] })]))
            .pipe($if(!config.env.skipCSSO, $csso()))
            .pipe($if(config.env.debug, $sourcemaps.write()))
            .pipe(gulp.dest(config.paths.tmp+'/assets/css')),
        gulp.src([config.paths.generated+'/assets/vendor/**/*.css'])
            .pipe($concat('vendor.css'))
            .pipe($if(!config.env.skipCSSO, $csso()))
            .pipe(gulp.dest(config.paths.tmp+'/assets/vendor'))
    );
});
