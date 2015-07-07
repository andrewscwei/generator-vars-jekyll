/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Cleans /<%= paths.generated %>, /<%= paths.tmp %> and /<%= paths.build %>
 *  directories.
 */

var config = require('./config');
var gulp = require('gulp');
var $cache = require('gulp-cache');

gulp.task('clean', function(callback)
{
    require('del')([config.paths.generated, config.paths.tmp, config.paths.build], function()
    {
        $cache.clearAll(callback);
    });
});
