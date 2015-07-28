/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Runs the Jekyll build taks to generate all the templates. These files are generated to the
 *  /<%= paths.generated %> directory. Drafts are automatically built in debug environment.
 *
 *  @param {Boolean} debug
 */

var config = require('./config');
var gulp = require('gulp');
var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var spawn = require('child_process').spawn;
var $util = require('gulp-util');

gulp.task('generate', function(callback)
{
    var proc;

    if (config.env.debug)
    {
        if (config.env.watch)
        {
            proc = spawn(jekyll, ['build', '--drafts', '--watch', '--destination='+config.paths.generated]);
        }
        else
        {
            proc = spawn(jekyll, ['build', '--drafts', '--destination='+config.paths.generated]);
        }
    }
    else
    {
        proc = spawn(jekyll, ['build', '--destination='+config.paths.generated]);
    }

    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', function(data)
    {
        $util.log('\n'+data);

        // TODO: This is pretty hacky. Think of a better way?
        if (config.env.watch && (data && data.indexOf('Auto-regeneration:') > -1))
        {
            callback();
        }
    });

    proc.stderr.setEncoding('utf8');
    proc.stderr.on('data', function(data)
    {
        $util.log('\n'+data);
    });

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
