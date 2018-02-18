/* eslint import/no-extraneous-dependencies:0 */
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const istanbul = require('rollup-plugin-istanbul');

module.exports = {
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
};
