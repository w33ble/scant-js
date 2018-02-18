const rollupConfig = require('./.rollup_karma');
const isCI = Boolean(process.env.CI);

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
