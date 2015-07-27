/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Serves the app locally. In production, watch option is not supported. This is meant for
 *  development only.
 *
 *  @param {Boolean} debug
 *  @param {Number}  port
 *  @param {Boolean} watch
 */

var browserSync = require('browser-sync');
var config = require('./config');
var gulp = require('gulp');
var sequence = require('run-sequence');
var $util = require('gulp-util');

gulp.task('serve', function()
{
    if (config.env.watch && !config.env.debug)
    {
        $util.log($util.colors.yellow('Watch is not supported in production. Please specify ') + '--debug' + $util.colors.yellow(' instead.'));
        return;
    }

    var baseDir = (config.env.debug) ? config.paths.tmp : config.paths.build;

    browserSync(
    {
        notify: false,
        port: (typeof config.env.port === 'number') ? config.env.port : 9000,
        server:
        {
            baseDir: [baseDir]
        }
    });

    // Watch for changes.
    if (config.env.watch)
    {
        gulp.watch('_config.yml', function() { sequence('generate', 'build', browserSync.reload); });
        gulp.watch(config.paths.src+'/**/*.'+config.patterns.data, function() { sequence('generate', 'build', browserSync.reload); });
        gulp.watch(config.paths.src+'/**/*.'+config.patterns.images, function() { sequence('generate', 'images', browserSync.reload); });
        gulp.watch(config.paths.src+'/**/*.'+config.patterns.videos, function() { sequence('generate', 'videos', browserSync.reload); });
        gulp.watch(config.paths.src+'/**/*.'+config.patterns.styles, function() { sequence('generate', 'styles', browserSync.reload); });
        gulp.watch(config.paths.src+'/**/*.'+config.patterns.scripts, function() { sequence('generate'); });
        gulp.watch(config.paths.tmp+'/**/*.'+config.patterns.scripts, browserSync.reload);
        gulp.watch(config.paths.src+'/**/*.'+config.patterns.templates, function() { sequence('generate', 'templates', browserSync.reload); });
    }
});
