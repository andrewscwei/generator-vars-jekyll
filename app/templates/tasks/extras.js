/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Compiles and deploys misc files to the /<%= paths.tmp %> directory.
 */

var config = require('./config');
var gulp = require('gulp');

gulp.task('extras', function()
{
    return gulp.src([config.paths.generated+'/**/*.'+config.patterns.extras])
        .pipe(gulp.dest(config.paths.tmp));
});
