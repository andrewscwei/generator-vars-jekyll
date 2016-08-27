<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
import autoprefixer from 'autoprefixer';
import config from './.taskconfig';
import gulp from 'gulp';
import path from 'path';
import rimraf from 'rimraf';
import sequence from 'run-sequence';
import webpack from 'webpack';
import $postcss from 'gulp-postcss';
import $replace from 'gulp-replace';
import $rev from 'gulp-rev';
import $sass from 'gulp-sass';
import $size from 'gulp-size';
import $sourcemaps from 'gulp-sourcemaps';
import $util from 'gulp-util';
import _ from 'lodash';

/**
 * Compiles and deploys images.
 */
gulp.task('images', () => {
  return gulp.src(config.images.entry)
    .pipe($size({ title: '[images]', gzip: true }))
    .pipe(gulp.dest(config.images.output));
});

/**
 * Compiles and deploys videos.
 */
gulp.task('videos', () => {
  return gulp.src(config.videos.entry)
    .pipe($size({ title: '[videos]', gzip: true }))
    .pipe(gulp.dest(config.videos.output));
});

/**
 * Compiles and deploys fonts.
 */
gulp.task('fonts', () => {
  return gulp.src(config.fonts.entry)
    .pipe($size({ title: '[fonts]', gzip: true }))
    .pipe(gulp.dest(config.fonts.output));
});

/**
 * Compiles and deploys stylesheets.
 *
 * @param {boolean} debug
 */
gulp.task('styles', () => {
  if (config.env.debug) {
    return gulp.src(config.styles.entry)
      .pipe($sourcemaps.init())
      .pipe($sass(config.styles.sass).on('error', $sass.logError))
      .pipe($postcss([autoprefixer(config.styles.autoprefixer)]))
      .pipe($sourcemaps.write('/'))
      .pipe($size({ title: '[styles:app]', gzip: true }))
      .pipe(gulp.dest(config.styles.output));
  }
  else {
    return gulp.src(config.styles.entry)
      .pipe($sass(config.styles.sass).on('error', $sass.logError))
      .pipe($postcss([autoprefixer(config.styles.autoprefixer)]))
      .pipe($size({ title: '[styles:app]', gzip: true }))
      .pipe(gulp.dest(config.styles.output));
  }
});

/**
 * Compiles all JavaScript bundle files. This task assumes that all bundle files
 * are located in /app/assets/js and ignores all sub-directories. File watching
 * is available here.
 *
 * @param {boolean} debug
 * @param {boolean} watch
 */
gulp.task('scripts', (callback) => {
  if (config.env.watch && !config.env.debug) {
    $util.log($util.colors.yellow('Watch is not supported in production.'));
    callback();
  }
  else {
    let guard = false;

    if (config.env.debug && config.env.watch)
      webpack(config.scripts).watch(100, build(callback));
    else
      webpack(config.scripts).run(build(callback));

    function build(done) {
      return (err, stats) => {
        if (err)
          throw new $util.PluginError('webpack', err);
        else
          $util.log($util.colors.green('[webpack]'), stats.toString());

        if (!guard && done) {
          guard = true;
          done();
        }
      };
    }
  }
});

/**
 * Appends content hash to static files.
 */
gulp.task('rev', (callback) => {
  gulp.src(config.rev.entry)
    .pipe($rev())
    .pipe(gulp.dest(config.rev.output))
    .pipe($rev.manifest(config.rev.manifestFile))
    .pipe(gulp.dest(config.rev.output))
    .on('end', () => {
      const manifestFile = path.join(config.rev.output, config.rev.manifestFile);
      const manifest = require(manifestFile);
      let removables = [];
      let pattern = _.map(_.keys(manifest), v => (`${v}\\b`)).join('|');

      for (let v in manifest) {
        if (v !== manifest[v]) removables.push(path.join(config.rev.output, v));
      }

      removables.push(manifestFile);

      rimraf(`{${removables.join(',')}}`, () => {
        if (!_.isEmpty(config.cdn)) {
          gulp.src(config.rev.replace)
            .pipe($replace(new RegExp(`((?:\\.?\\.\\/?)+)?([\\/\\da-z\\.-]+)(${pattern})`, 'gi'), (m) => {
              let k = m.match(new RegExp(pattern, 'i'))[0];
              let v = manifest[k];
              return m.replace(k, v).replace(/^((?:\.?\.?\/?)+)?/, _.endsWith(config.cdn, '/') ? config.cdn : `${config.cdn}/`);
            }))
            .pipe(gulp.dest(config.rev.output))
            .on('end', callback)
            .on('error', callback);
        }
        else {
          gulp.src(config.rev.replace)
            .pipe($replace(new RegExp(`${pattern}`, 'gi'), (m) => (manifest[m])))
            .pipe(gulp.dest(config.rev.output))
            .on('end', callback)
            .on('error', callback);
        }
      });
    })
    .on('error', callback);
});

/**
 * Watch for file changes.
 */
gulp.task('watch', () => {
  let entries = config.watch.entries;
  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];
    gulp.watch(entry.files, entry.tasks);
  }
});

/**
 * Default Gulp task. This is the task that gets executed when you run the shell
 * command 'gulp'. This task will wipe the compiled files and rebuild
 * everything, with on-complete options such as serving the app in the dev
 * server.
 *
 * @param {boolean} debug
 * @param {boolean} watch
 */
gulp.task('default', () => {
  if (config.env.watch && !config.env.debug) {
    $util.log($util.colors.yellow('Watch is not supported in production.'));
    return;
  }

  let seq = ['images', 'videos', 'fonts', 'styles', 'scripts'];

  if (!config.env.debug) seq.push('rev');
  if (config.env.watch) seq.push('watch');

  sequence.apply(null, seq);
});

