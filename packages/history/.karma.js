const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const istanbul = require('rollup-plugin-istanbul');

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
    rollupPreprocessor: {
      format: 'iife',
      name: 'history',
      sourcemap: 'inline',
      plugins: [
        json(),
        commonjs(),
        builtins(),
        globals(),
        resolve({
          jsnext: false,
          module: false,
          browser: true,
          preferBuiltins: true,
        }),
        istanbul({
          include: ['./src/**/*.js'],
        }),
        babel({
          exclude: ['node_modules/**', '../../node_modules/**'],
        }),
      ],
    },
  });
};
