const { config } = require('@scant/rollup-helper');
const pkg = require('./package.json');

const isCI = Boolean(process.env.CI);
const rollupConfig = config.test(pkg);

module.exports = function(config) {
  config.set({
    frameworks: ['tap'],
    files: ['test/index.js'],
    preprocessors: {
      'test/**/*.js': ['rollup'],
    },
    autoWatch: false,
    singleRun: isCI,
    logLevel: config.LOG_WARN,
    browsers: isCI ? ['Firefox'] : ['Chrome', 'Firefox'],
    browserConsoleLogOptions: {
      level: config.LOG_WARN,
    },
    reporters: ['progress', 'coverage-istanbul'],
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly'],
      dir: 'coverage',
      'report-config': {
        html: {
          subdir: 'html',
        },
      },
    },
    rollupPreprocessor: rollupConfig,
  });
};
