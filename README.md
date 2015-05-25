# generator-vars-jekyll

VARIANTE's Yeoman generator for a Jekyll app.

## Features

- [Jekyll](http://jekyllrb.com)
- [Gulp](http://gulpjs.com) setup for CSS, JavaScript, and HTML minification as well as static asset revisioning (appending content hash to filenames)
- [BrowserSync](http://www.browsersync.io) for rapid development
- [Sass](http://sass-lang.com) with Scalable and Modular Architecture (SMACSS) setup
- [Browserify](http://browserify.org)
- [Sublime](http://www.sublimetext.com) project (optional)
- [Heroku](http://heroku.com) setup

## Libraries

- Bootstrap (optional)
- jQuery (optional)

If you are looking for [Modernizr](http://modernizr.com), we recommend manually configuring your custom build and put it in ```app/assets/vendor``` folder.

## Structure

```
.
+-- app
|   +-- _data
|   +-- _drafts
|   +-- _includes
|   +-- _layouts
|   |   +-- default.html
|   +-- _posts
|   +-- assets
|   |   +-- styles
|   |   |   +-- base
|   |   |   |   +-- layout.scss
|   |   |   |   +-- normalize.scss
|   |   |   |   +-- typography.scss
|   |   |   +-- components
|   |   |   +-- modules
|   |   |   +-- main.scss
|   |   +-- images
|   |   +-- scripts
|   |   |   +-- main.js
|   |   +-- vendor
|   +-- apple-touch-icon-57x57.png
|   +-- apple-touch-icon-72x72.png
|   +-- apple-touch-icon-114x114.png
|   +-- apple-touch-icon.png
|   +-- favico.ico
|   +-- favico.png
|   +-- og-image.png
|   +-- 404.html
|   +-- 500.html
|   +-- index.html
|   +-- README.md
|   +-- robots.txt
+-- public // runtime files go here
+-- test // mocha tests
+-- node_modules
+-- .editorconfig
+-- .gitattributes
+-- .gitignore
+-- .jshintrc
+-- .yo-rc.json
+-- _config.yml
+-- Gemfile
+-- gulpfile.js
+-- package.json
+-- server.js
```

## Tasks

```gulp build --debug```: Builds all source files in the ```app``` directory but skips all compression tasks.

```gulp build```: Builds all source fies in the ```app``` directory with asset compression such as CSS/HTML/JavaScript minification and deploys them to the ```build``` directory.

```gulp serve --debug```: Serves the ```.tmp``` directory to ```localhost``` and immediately watches source files for changes. Any change in the source files will invoke its corresponding build tasks. This is great for debugging.

```gulp serve```: Serves the ```build``` directory to ```localhost``` and immediately watches source files for changes. Any change in the source files will invoke a ```gulp build```. This command is not meant for debugging purposes and is for production testing only.

See ```gulpfile.js``` for more tasks and custom flags such as ```--skip-uglify```, ```--skip-csso```, etc.

## Usage

Install ```yo```:
```
npm install -g yo
```

Install ```generator-vars-jekyll```:
```
npm install -g generator-vars-jekyll
```

Create a new directory for your project and ```cd``` into it:
```
mkdir new-project-name && cd $_
```

Generate the project:
```
yo vars-jekyll [app-name]
```

For details on initial setup procedures of the project, see its generated ```README.md``` file.

## Common Issues

1. If ```node-sass``` is giving you errors, try rebuilding it by running ```$ npm rebuild node-sass```.
2. If ```gulp images``` is failing due to some error in ```gulp-imagemin```, try reinstalling it.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
