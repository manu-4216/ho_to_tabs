(function() {
  'use strict';

  var jshint = require('simplebuild-jshint');

  desc('Default build');
  task('default', ['version', 'lint'], function() {
    console.log("\n\nBUILD OK");
  });

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
      options: {},
      globals: {}
    }, complete, fail);
    //jake.exec('node node_modules/jshint/bin/jshint Jakefile.js', { interactive: true }, complete);

  }, { async: true });

}());
