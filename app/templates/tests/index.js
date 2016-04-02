<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>
'use strict';

let app = require('../server');
let request = require('supertest');

describe('index', function() {
  it('should respond to GET', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});
