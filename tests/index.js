/**
 * generator-vars-jekyll
 * (c) VARIANTE <http://variante.io>
 *
 * This software is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

const path = require('path');
const helpers = require('yeoman-test');

describe('test framework', () => {
  it('runs', (done) => {
    helpers.run(path.join(__dirname, '../app'))
      .on('end', done);
  });
});

// Add more tests...later :)
