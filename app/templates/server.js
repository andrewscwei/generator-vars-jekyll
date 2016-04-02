<% if (appauthor !== '') { %> // (c) <%= appauthor %><% } %>

'use strict';

var express = require('express');
var compress = require('compression');
var cors = require('cors');
var path = require('path');
var http = require('http');
var app = express();

var publicPath = path.join(__dirname, '<%= paths.build %>');
var port = process.env.PORT || 3000;

// Enable CORS.
app.use(cors());

// Enable gzip compression.
app.use(compress());

// Add expire headers to static files.
app.use(function(req, res, next) {
  if ((req.url.indexOf('/assets/') === 0) || (req.url.indexOf('/media/') === 0) || (req.url.indexOf('/favicon.png') === 0)) {
    res.setHeader('Expires', new Date(Date.now() + 345600000).toUTCString());
    res.setHeader('Cache-Control', 'public, max-age=345600000');
  }
  return next();
});

// Set base directory to serve.
app.use(express.static(publicPath));

// Handle 404 error.
app.use(function(req, res, next) {
  res.status(404).sendFile(path.join(publicPath, '404.html'));
});

// Handle 500 error.
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).sendFile(path.join(publicPath, '500.html'));
});

// Start listening at designated port.
var server = http.createServer(app);

server
  .listen(port)
  .on('error', function(error) {
    if (error.syscall !== 'listen') throw error;

    var bind = 'Port '+port;

    // Handle specific listen errors with friendly messages.
    switch (error.code) {
      case 'EACCES':
        console.error(bind+'requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind+'is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  })
  .on('listening', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://'+host+':'+port);
  });

module.exports = app;

