/**
 * generator-vars-jekyll
 * (c) VARIANTE <http://variante.io>
 *
 * This software is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('projectname', {
      type: String,
      required: false
    });

    this.appname = this.projectname || this.appname;

    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install', {
      desc: 'Skips the installation of dependencies',
      type: Boolean
    });
  },

  initializing: function() {
    this.pkg = require('../package.json');
    this.paths = {
      src: 'app',
      build: 'public',
      tmp: '.tmp'
    };
  },

  prompting: {
    welcome: function() {
      var done = this.async();

      if (!this.options['skip-welcome-message']) {
        this.log(yosay('\'Allo \'allo! Out of the box I include Sass, Browserify and a gulpfile.js to build your app.'));
      }

      var prompts = [{
        type: 'input',
        name: 'appauthor',
        message: 'Who is the author? (this will appear in the header of your source files)'
      }, {
        type: 'input',
        name: 'appauthoremail',
        message: 'What is your email? (this will appear in the header of your source files)'
      }];

      this.prompt(prompts, function(answers) {
        this.appauthor = answers.appauthor;
        this.appauthoremail = answers.appauthoremail;

        done();
      }.bind(this));
    },

    features: function() {
      var done = this.async();

      var prompts = [{
        type: 'checkbox',
        name: 'features',
        message: 'What more would you like?',
        choices: [{
          name: 'Bootstrap',
          value: 'includeBootstrap',
          checked: false
        }, {
          name: 'jQuery',
          value: 'includejQuery',
          checked: false
        }]
      }];

      this.prompt(prompts, function(answers) {
        var features = answers.features;

        var hasFeature = function(feat) {
          return features.indexOf(feat) !== -1;
        };

        this.includeBootstrap = hasFeature('includeBootstrap');
        this.includejQuery = hasFeature('includejQuery');

        done();
      }.bind(this));
    }
  },

  writing: {
    skeleton: function() {
      this.mkdir(this.paths.src + '/_data');
      this.mkdir(this.paths.src + '/_assets');
      this.mkdir(this.paths.src + '/_drafts');
      this.mkdir(this.paths.src + '/_includes');
      this.mkdir(this.paths.src + '/_layouts');
      this.mkdir(this.paths.src + '/_posts');
    },

    config: function() {
      this.copy('gitignore', '.gitignore');
      this.copy('gitattributes', '.gitattributes');
      this.copy('editorconfig', '.editorconfig');
      this.copy('buildpacks', '.buildpacks');
      this.copy('_config.yml', '_config.yml');
      this.copy('app/robots.txt', this.paths.src + '/robots.txt');

      this.copy('jshintrc', '.jshintrc');
      this.copy('app/jshintrc', 'app/.jshintrc');
      this.copy('tasks/jshintrc', 'tasks/.jshintrc');

      this.template('server.js');
      this.template('Gemfile');
      this.template('package.json');
      this.template('README.md');

      this.template('gulpfile.js');
      this.template('tasks/taskconfig', 'tasks/.taskconfig');
      this.template('tasks/build.js');
      this.template('tasks/clean.js');
      this.template('tasks/generate.js');
      this.template('tasks/serve.js');
    },

    static: function() {
      this.mkdir(this.paths.src + '/_assets/images');

      this.copy('app/favicon.ico', this.paths.src + '/favicon.ico');
      this.copy('app/_assets/images/favicon.png', this.paths.src + '/_assets/images/favicon.png');
      this.copy('app/_assets/images/apple-touch-icon-57x57.png', this.paths.src + '/_assets/images/apple-touch-icon-57x57.png');
      this.copy('app/_assets/images/apple-touch-icon-72x72.png', this.paths.src + '/_assets/images/apple-touch-icon-72x72.png');
      this.copy('app/_assets/images/apple-touch-icon-114x114.png', this.paths.src + '/_assets/images/apple-touch-icon-114x114.png');
      this.copy('app/_assets/images/apple-touch-icon.png', this.paths.src + '/_assets/images/apple-touch-icon.png');
      this.copy('app/_assets/images/og-image.png', this.paths.src + '/_assets/images/og-image.png');

      this.mkdir(this.paths.src + '/_assets/css');
      this.mkdir(this.paths.src + '/_assets/css/base');
      this.mkdir(this.paths.src + '/_assets/css/components');
      this.mkdir(this.paths.src + '/_assets/css/modules');

      this.template('app/_assets/css/main.scss', this.paths.src + '/_assets/css/main.scss');
      this.template('app/_assets/css/base/definitions.scss', this.paths.src + '/_assets/css/base/definitions.scss');
      this.template('app/_assets/css/base/normalize.scss', this.paths.src + '/_assets/css/base/normalize.scss');
      this.template('app/_assets/css/base/typography.scss', this.paths.src + '/_assets/css/base/typography.scss');
      this.template('app/_assets/css/base/layout.scss', this.paths.src + '/_assets/css/base/layout.scss');

      this.mkdir(this.paths.src + '/_assets/js');
      this.template('app/_assets/js/main.js', this.paths.src + '/_assets/js/main.js');

      this.mkdir(this.paths.src + '/_assets/vendor');
    },

    templates: function() {
      this.template('app/404.html', this.paths.src + '/404.html');
      this.template('app/500.html', this.paths.src + '/500.html');
      this.template('app/index.html', this.paths.src + '/index.html');
      this.template('app/_layouts/default.html', this.paths.src + '/_layouts/default.html');
    },

    test: function() {
      this.composeWith(this.options['test-framework'] + ':app', {
        options: {
          'skip-install': this.options['skip-install']
        }
      }, {
        local: require.resolve('generator-mocha/generators/app/index.js')
      });
    }
  },

  install: {
    bundle: function() {
      var done = this.async();

      if (this.options['skip-install']) {
        this.log('Skipping gem dependency installation. You will have to manually run ' + chalk.yellow.bold('bundle install --path vendor/bundle') + '.');
        done();
      } else {
        this.log(chalk.magenta('Installing gems for you using your ') + chalk.yellow.bold('Gemfile') + chalk.magenta('...'));
        this.spawnCommand('bundle', ['install', '--path', 'vendor/bundle']).on('exit', function(code) {
          if (code !== 0) {
            this.log(chalk.red('Installation failed. Please manually run ') + chalk.yellow.bold('bundle install --path vendor/bundle') + chalk.red('.'));
          }

          done();
        }.bind(this));
      }
    },

    npm: function() {
      if (this.options['skip-install']) {
        this.log('Skipping node dependency installation. You will have to manually run ' + chalk.yellow.bold('npm install') + '.');
      } else {
        this.log(chalk.magenta('Installing node modules for you using your ') + chalk.yellow.bold('package.json') + chalk.magenta('...'));

        this.installDependencies({
          skipMessage: true,
          bower: false
        });
      }
    }
  },

  end: function() {
    this.log(chalk.green('Finished generating app! See the generated ') + chalk.yellow('README.md') + chalk.green(' for more guidelines. To start developing right away, run: ') + chalk.yellow.bold('gulp --d --w --s'));
  }
});
