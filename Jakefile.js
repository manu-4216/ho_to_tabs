/* globals jake:false, desc:false, task:false, complete:false, fail:false */

(function() {
  'use strict';

  var jshint = require('simplebuild-jshint');
  var karma = require('simplebuild-karma');
  var shell = require('shelljs');

  var DIST_DIR = 'generated/dist';

  //*** General purpose tasks

  desc('Start karma server(run this first)');
  task('karma', function() {
      console.log('Start Karma server');
      karma.start({
        configFile: 'karma.conf.js'
      }, complete, fail);
  }, {async: true});

  desc('Default build');
  task('default', ['version', 'lint', 'test'], function() {
    console.log("BUILD OK");
  });

  desc('Run test');
  task('test', function() {
    console.log('testing js');
    karma.run({
      configFile: 'karma.conf.js'
    }, complete, fail);
  }, {async: true});

  desc('Run a localhost server');
  task('run', ['build'], function() {
    jake.exec('node node_modules/http-server/bin/http-server ' + DIST_DIR, { interactive: true }, complete);
    console.log('Running http-server');
  }, { async: true });

  desc('Clean all generated files');
  task('clean', function() {
    console.log('Erasing generated files:');
    shell.rm('-rf', 'generated');
  });

  desc('Build');
  task('build', [ DIST_DIR ], function() {
    console.log('Building distribution directory:');
    shell.rm('-rf', DIST_DIR + '/*');
    shell.cp('src/index.html', DIST_DIR);

    jake.exec('node node_modules/browserify/bin/cmd.js src/app.js -o ' + DIST_DIR + '/bundle.js', { interactive: true}, complete);
  }, { async: true});

  directory(DIST_DIR);

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
      files: ["Jakefile.js", "src/**/*.js"],
      options: lintOptions(),
      globals: lintGlobals(),
    }, complete, fail);
    //jake.exec('node node_modules/jshint/bin/jshint Jakefile.js', { interactive: true }, complete);

  }, { async: true });

  function lintOptions() {
    return {
        bitwise: true,
        freeze: true,
        strict: true,
        undef: true, // ! Add globals at the beginning.

        node: true,
        browser: true
      };
  }

  function lintGlobals() {
    return {
      // Mocha
      describe: false,
      it: false,
      before: false,
      after: false,
      beforeEach: false,
      afterEach: false
    };
  }

}());
