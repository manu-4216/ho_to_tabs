/* globals jake:false, desc:false, task:false, complete:false, fail:false */

(function() {
  'use strict';

  var jshint = require('simplebuild-jshint');

  //*** General purpose tasks

  desc('Default build');
  task('default', ['version', 'lint'], function() {
    console.log("\n\nBUILD OK");
  });


  desc('Run a localhost server');
  task('run', function() {
    jake.exec('node node_modules/http-server/bin/http-server src', { interactive: true }, complete);
    console.log('Running http-server');
  }, { async: true });


  //*** Supporting tasks

  desc('Checking node version');
  task('version', function() {
    var packageJson = require('./package.json');

    console.log('Checking node version...');
    var expectedVersion = "v" + packageJson.engines.node;
    var actualNodeVersion = process.version;

    if (actualNodeVersion !== expectedVersion) {
      var stringLog = "node version doesn't match." +
                      " Expected: " + expectedVersion +
                      ". Actual: "  + actualNodeVersion;
      fail(stringLog);
    } else {
      // All good. No need to say anything.
    }

  });

  desc('Lint check');
  task('lint', function(){
    process.stdout.write('Linting JS: ');

    jshint.checkFiles({
      files: "Jakefile.js",
      options: {
        bitwise: true,
        freeze: true,
        strict: true,
        undef: true, // ! Add globals at the beginning.

        node: true,
        browser: true
      },
      globals: {}
    }, complete, fail);
    //jake.exec('node node_modules/jshint/bin/jshint Jakefile.js', { interactive: true }, complete);

  }, { async: true });

}());
