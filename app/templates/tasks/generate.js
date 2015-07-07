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

gulp.task('generate', function(callback)
{
    var proc;

    if (config.env.debug)
    {
        proc = spawn(jekyll, ['build', '--drafts', '--destination='+config.paths.generated], { stdio: 'inherit' });
    }
    else
    {
        proc = spawn(jekyll, ['build', '--destination='+config.paths.generated], { stdio: 'inherit' });
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
