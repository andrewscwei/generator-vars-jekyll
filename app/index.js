/**
 *  generator-vars-jekyll
 *  (c) VARIANTE <http://variante.io>
 *
 *  This software is released under the MIT License:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend
(
    {
        constructor: function()
        {
            yeoman.generators.Base.apply(this, arguments);

            this.argument('projectname', { type: String, required: false });
            this.appname = this.projectname || this.appname;

            this.option('test-framework',
            {
                desc: 'Test framework to be invoked',
                type: String,
                defaults: 'mocha'
            });

            this.option('skip-welcome-message',
            {
                desc: 'Skips the welcome message',
                type: Boolean
            });

            this.option('skip-install',
            {
                desc: 'Skips the installation of dependencies',
                type: Boolean
            });

            this.option('skip-install-message',
            {
                desc: 'Skips the message after the installation of dependencies',
                type: Boolean
            });
        },

        initializing: function()
        {
            this.pkg = require('../package.json');
            this.paths =
            {
                src: 'app',
                build: 'public',
                generated: '.generated',
                tmp: '.tmp'
            };
        },

        prompting:
        {
            welcome: function()
            {
                var done = this.async();

                if (!this.options['skip-welcome-message'])
                {
                    this.log(yosay('\'Allo \'allo! Out of the box I include Sass, Browserify and a gulpfile.js to build your app.'));
                }

                var prompts =
                [
                    {
                        type: 'input',
                        name: 'appauthor',
                        message: 'Who is the author? (this will appear in the header of your source files)'
                    },
                    {
                        type: 'input',
                        name: 'appauthoremail',
                        message: 'What is your email? (this will appear in the header of your source files)'
                    }
                ];

                this.prompt(prompts, function(answers)
                {
                    this.appauthor = answers.appauthor;
                    this.appauthoremail = answers.appauthoremail;

                    done();
                }.bind(this));
            },

            features: function()
            {
                var done = this.async();

                var prompts =
                [
                    {
                        type: 'checkbox',
                        name: 'features',
                        message: 'What more would you like?',
                        choices:
                        [
                            {
                                name: 'Bootstrap',
                                value: 'includeBootstrap',
                                checked: false
                            },
                            {
                                name: 'jQuery',
                                value: 'includejQuery',
                                checked: false
                            },
                            {
                                name: 'Sublime',
                                value: 'includeSublime',
                                checked: true
                            },
                        ]
                    }
                ];

                this.prompt(prompts, function(answers)
                {
                    var features = answers.features;

                    var hasFeature = function(feat)
                    {
                        return features.indexOf(feat) !== -1;
                    };

                    this.includeBootstrap = hasFeature('includeBootstrap');
                    this.includejQuery = hasFeature('includejQuery');
                    this.includeSublime = hasFeature('includeSublime');

                    done();
                }.bind(this));
            }
        },

        writing:
        {
            skeleton: function()
            {
                this.mkdir(this.paths.src+'/_data');
                this.mkdir(this.paths.src+'/_drafts');
                this.mkdir(this.paths.src+'/_includes');
                this.mkdir(this.paths.src+'/_layouts');
                this.mkdir(this.paths.src+'/_posts');
            },

            config: function()
            {
                this.copy('gitignore', '.gitignore');
                this.copy('gitattributes', '.gitattributes');
                this.copy('jshintrc', '.jshintrc');
                this.copy('editorconfig', '.editorconfig');
                this.copy('_config.yml', '_config.yml');
                this.copy('app/robots.txt', this.paths.src+'/robots.txt');

                this.template('server.js');
                this.template('gulpfile.js');
                this.template('Gemfile');
                this.template('package.json', 'package.json');
                this.template('README.md', 'README.md');

                if (this.includeSublime)
                {
                    this.template('sublime-project', this.appname + '.sublime-project');
                }
            },

            static: function()
            {
                this.mkdir(this.paths.src+'/assets');
                this.mkdir(this.paths.src+'/assets/images');

                this.copy('app/favicon.ico', this.paths.src+'/favicon.ico');
                this.copy('app/favicon.png', this.paths.src+'/favicon.png');
                this.copy('app/apple-touch-icon-57x57.png', this.paths.src+'/apple-touch-icon-57x57.png');
                this.copy('app/apple-touch-icon-72x72.png', this.paths.src+'/apple-touch-icon-72x72.png');
                this.copy('app/apple-touch-icon-114x114.png', this.paths.src+'/apple-touch-icon-114x114.png');
                this.copy('app/apple-touch-icon.png', this.paths.src+'/apple-touch-icon.png');
                this.copy('app/og-image.png', this.paths.src+'/og-image.png');

                this.mkdir(this.paths.src+'/assets/css');
                this.mkdir(this.paths.src+'/assets/css/base');
                this.mkdir(this.paths.src+'/assets/css/components');
                this.mkdir(this.paths.src+'/assets/css/modules');

                this.template('app/assets/css/main.scss', this.paths.src+'/assets/css/main.scss');
                this.template('app/assets/css/base/mixins.scss', this.paths.src+'/assets/css/base/mixins.scss');
                this.template('app/assets/css/base/normalize.scss', this.paths.src+'/assets/css/base/normalize.scss');
                this.template('app/assets/css/base/typography.scss', this.paths.src+'/assets/css/base/typography.scss');
                this.template('app/assets/css/base/layout.scss', this.paths.src+'/assets/css/base/layout.scss');

                this.mkdir(this.paths.src+'/assets/js');
                this.template('app/assets/js/main.js', this.paths.src+'/assets/js/main.js');

                this.mkdir(this.paths.src+'/assets/vendor');
            },

            templates: function()
            {
                this.template('app/404.html', this.paths.src+'/404.html');
                this.template('app/500.html', this.paths.src+'/500.html');
                this.template('app/index.html', this.paths.src+'/index.html');
                this.template('app/_layouts/default.html', this.paths.src+'/_layouts/default.html');
            }
        },

        install:
        {
            bundle: function()
            {
                var done = this.async();

                if (this.options['skip-install'])
                {
                    this.log('\nSkipping gem dependency installation. You will have to manually run ' + chalk.yellow.bold('bundle install --path vendor/bundle') + '.');
                    done();
                }
                else
                {
                    this.log('\nInstalling gems for you using your ' + chalk.yellow.bold('Gemfile') + '...');
                    this.spawnCommand('bundle', ['install', '--path', 'vendor/bundle']).on('exit', function(code)
                    {
                        if (code !== 0)
                        {
                            this.log('\n' + chalk.red('Installation failed. Please manually run ') + chalk.yellow.bold('bundle install --path vendor/bundle') + chalk.red('.'));
                        }

                        done();
                    }.bind(this));
                }
            },

            npm: function()
            {
                var done = this.async();

                if (this.options['skip-install'])
                {
                    this.log('\nSkipping node dependency installation. You will have to manually run ' + chalk.yellow.bold('npm install') + '.');
                    done();
                }
                else
                {
                    this.log('\nInstalling node modules for you using your ' + chalk.yellow.bold('package.json') + '...');
                    this.spawnCommand('npm', ['install', '--ignore-scripts']).on('exit', function(code)
                    {
                        if (code !== 0)
                        {
                            this.log('\n' + chalk.red('Installation failed. Please manually run ') + chalk.yellow.bold('npm install') + chalk.red('.'));
                        }

                        done();
                    }.bind(this));
                }
            }
        },

        end: function()
        {
            this.log('\n' + chalk.green('Finished generating app!'));

            // Ideally we should use composeWith, but we're invoking it here
            // because generator-mocha is changing the working directory
            // https://github.com/yeoman/generator-mocha/issues/28.
            this.invoke(this.options['test-framework'],
            {
                options:
                {
                    'skip-message': this.options['skip-install-message'],
                    'skip-install': this.options['skip-install']
                }
            });
        }
    }
);
