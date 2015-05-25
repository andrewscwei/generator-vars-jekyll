/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 */

'use strict';

var express = require('express');
var compress = require('compression');
var app = express();

var root = __dirname + '/public';

// Enable gzip compression.
app.use(compress());

// Add expire headers to static files.
app.use(function(req, res, next)
{
    if ((req.url.indexOf('/assets/') === 0) || (req.url.indexOf('/favicon.png') === 0))
    {
        res.setHeader('Cache-Control', 'public, max-age=345600');
        res.setHeader('Expires', new Date(Date.now() + 345600000).toUTCString());
    }

    return next();
});

// Set base directory to serve.
app.use(express.static(root));

// Handle 404 error.
app.use(function(req, res, next)
{
    res.status(404).sendFile(root + '/404.html');
});

// Handle 500 error.
app.use(function(err, req, res, next)
{
    console.error(err.stack);
    res.status(500).sendFile(root + '/500.html');
});

// Start listening at designated port.
app.listen(process.env.PORT || 9000);

console.log('Listening on port ' + (process.env.PORT || 9000) + '...');