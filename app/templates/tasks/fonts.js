/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Compiles and deploys fonts to the /<%= paths.tmp %> directory.
 */

var config = require('./config');
var gulp = require('gulp');

gulp.task('fonts', function()
{
    return gulp.src([config.paths.generated+'/assets/**/*.'+config.patterns.fonts<% if (includeBootstrap) { %>, 'node_modules/bootstrap-sass/assets/**/*.'+config.patterns.fonts<% } %>])
        .pipe(gulp.dest(config.paths.tmp+'/assets'));
});
