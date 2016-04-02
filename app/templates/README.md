# <%= appname %>

This app is scaffolded by [Yeoman](http://yeoman.io) using the generator [generator-vars-jekyll](https://github.com/VARIANTE/generator-vars-jekyll.git). 

## Setup

### Local

```
$ bundle install
$ npm install
$ npm run prod
```

Visit `http://localhost:3000`, voila.

### Heroku

Create an app on Heroku and link to this repo. The generated `.buildpacks` file should then automatically configure [Heroku buildpacks](https://devcenter.heroku.com/articles/buildpacks) upon first deploy. If you do not plan on using a CI/CD service such as [CircleCI](https://circleci.com/) and wish to have Heroku automatically build this app everytime you deploy, tweak the following:

1. Allow the Node.js buildpack to install `devDependencies` by changing the environment variable `NPM_CONFIG_PRODUCTION` to `false` either in the dashboard or using [Heroku Toolbelt](https://toolbelt.heroku.com/):
  - `$ heroku config:set NPM_CONFIG_PRODUCTION=false`
2. Add a `postinstall` script to `package.json` which triggers `npm run build`. This will tell Heroku to run the build pipeline everytime during a deploy.

When configured correctly Heroku should kick off `npm start` at the end of the deployment which spins up the generated Express server. Your app should now be live.

### CircleCI

This project comes with a `circle.yml` file with a pipeline set up for deploying to Heroku. With this set up, you no longer need to build your app on Heroku. Instead, CircleCI will build the app and only deploy runtime files to your Heroku instance (which means you don't need the Ruby buildpack at all). Note that you must grant CircleCI permission to interact with your Heroku instance. See their [guide](https://circleci.com/docs/continuous-deployment-with-heroku/).

### CDN

By default, during a CircleCI build, the pipeline will automatically prepend asset paths relative to root `/` in HTML/JS/CSS files with your CDN URL. To make this default behavior work the following requirements must be met:

1. You are using CircleCI to build the app
2. You are pushing changes at `master` (hence the environment variable `CIRCLE_BRANCH` is `master`)
3. The environment variable `CDN_PATH` is set, starting with `//` and ending with no trailing `/` (i.e. `//xxxxxxxxxx.cloudfront.net`).

## Environments

Use the environment variable `NODE_ENV` to set environments. Available options are `development` and `production`. In `development`, Jekyll drafts are generated while asset compression and revisioning are disabled. Webpack also outputs more debug info (i.e. sourcemaps). Vice-versa for production.

## Using External Libraries

The best practice is to use NPM to manage all external JS/CSS libraries. If you must resort to the legacy `<script>` method, you can dump all your vendor files inside `app/_assets/vendor` and Webpack will automatically concat them into `public/assets/javascripts/vendor.js`, which should already be included in `index.html`. For CSS, since we have the convenience of Sass imports, use NPM.

## Tasks

`$ npm start`: Starts the generated simple Express server. This task only starts the server. It does not compile any assets.

`$ npm test`: Runs user-defined tests defined in `/tests` recursively.

`$ npm run clean`: Cleans the `/public` directory.

`$ npm run dev`: Runs the app in development using `BrowserSync` as the dev server. In this mode file watching and live reloading are enabled while asset compression is disabled, hence you should always use this command during development.

`$ npm run prod`: Runs the app in production using the generated Express server. Assets are compiled, compressed, and hash-renamed.

While the major tasks are wrapped in NPM scripts, you can check out the micro tasks in `gulpfile.babel.js`. To configure task behaviors, check out `.taskconfig`.

## Blogging

For a user-friendly UI, use [prose.io](http://prose.io) for free to add/modify/remove blog posts as well as uploading required images. By default, a `_prose.yml` file is generated to abstract away files that are irrelevant to blogging.
