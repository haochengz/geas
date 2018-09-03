module.exports = function () {
  return {
    debug: true,
    files: [
      'package.json',
      '**/*.js',
      '!**/*.test.js',
      '!node_modules/**/*.js',
      '!**/*.foo.js'
    ],

    tests: [
      '**/*.test.js',
      '!node_modules/**/*.js'
    ],

    env: {
      type: 'node',
      runner: '/Users/hczhao/.nvm/versions/node/v8.11.2/bin/node'  // or full path to any node executable
    },
    testFramework: 'jest',
    setup: function (wallaby) {
      var jestConfig = require('./package.json').jest
      // for example:
      // jestConfig.globals = { "__DEV__": true };
      wallaby.testFramework.configure(jestConfig)
    }
  }
}
