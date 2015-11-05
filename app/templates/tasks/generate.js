/**
 * <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 * (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 */

var config = require('./.taskconfig');
var gulp = require('gulp');
var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var spawn = require('child_process').spawn;
var $util = require('gulp-util');

/**
 * Runs the Jekyll build taks to generate all the templates. These files are generated to the
 * /<%= paths.tmp %> directory. Drafts are automatically built in debug environment.
 *
 * @param {Boolean} debug
 * @param {Boolean} watch
 */
gulp.task('generate', function(callback) {
  var proc;
  var callbackGuard = false;

  if (config.env.watch && !config.debug) {
    $util.log($util.colors.yellow('Watch is not supported in production. Please specify ') + '--debug' + $util.colors.yellow('.'));
    callback();
    return;
  }

  if (config.debug) {
    if (config.env.watch) {
      proc = spawn(jekyll, ['build', '--drafts', '--watch', '--destination=' + config.paths.tmp]);
    } else {
      proc = spawn(jekyll, ['build', '--drafts', '--destination=' + config.paths.tmp]);
    }
  } else {
    proc = spawn(jekyll, ['build', '--destination=' + config.paths.tmp]);
  }

  proc.stdout.setEncoding('utf8');
  proc.stdout.on('data', function(data) {
    $util.log('\n' + data);

    // TODO: This is pretty hacky. Think of a better way?
    if (config.env.watch && (data && data.indexOf('Auto-regeneration:') > -1) && !callbackGuard) {
      callbackGuard = true;
      callback();
    }
  });

  proc.stderr.setEncoding('utf8');
  proc.stderr.on('data', function(data) {
    $util.log('\n' + data);
  });

  proc.on('exit', function(code) {
    if (code === 0) {
      callback();
    } else {
      return;
    }
  });
});
