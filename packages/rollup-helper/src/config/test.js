import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
// import istanbul from 'rollup-plugin-istanbul';
import { basePlugins } from './common';

export default {
  format: 'iife',
  name: 'history',
  sourcemap: 'inline',
  plugins: basePlugins.concat([
    resolve({
      jsnext: false,
      module: false,
      browser: true,
      preferBuiltins: true,
    }),
    // istanbul({
    //   include: ['./src/**/*.js'],
    // }),
    babel({
      exclude: ['node_modules/**', '../../node_modules/**'],
    }),
  ]),
};
