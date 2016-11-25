(function() {
  'use strict';



  desc('Default build');
  task('default', ['version'], function() {
    console.log("\n\nBUILD OK");
  });

  desc('Checking node version');
  task('version', function() {
    var packageJson = require('./package.json');

    console.log('Checking node version...');
    var expectedVersion = "v" + packageJson.engines.node;
    var actualNodeVersion = process.version;

    if (actualNodeVersion !== expectedVersion) {
      var stringLog = "node version doesn't match."
                    + " Expected: " + expectedVersion
                    + ". Actual: "  + actualNodeVersion;
      fail(stringLog);
    } else {
      // All good. No need to say anything.
    }

  });

  //var actualNodeVersion = process.version;


}());
