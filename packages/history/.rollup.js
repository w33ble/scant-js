import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import progress from 'rollup-plugin-progress';
import filesize from 'rollup-plugin-filesize';
import minify from 'rollup-plugin-babel-minify';
import pkg from './package.json';

const outputPath = 'dist';

const banner = `/*
${pkg.name} @ ${pkg.version}
License: ${pkg.license}
Built: ${new Date().toISOString()}
*/`;

const config = {
  input: 'src/index.js',
  plugins: [
    progress(),
    resolve({
      jsnext: false,
      module: false,
      browser: true,
      preferBuiltins: true,
    }),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
    filesize(),
  ],
};

export default [
  Object.assign({}, config, {
    output: {
      file: `${outputPath}/history.js`,
      format: 'es',
      name: pkg.name,
    },
  }),
  Object.assign({}, config, {
    sourcemap: true,
    banner,
    output: {
      file: `${outputPath}/history.umd.js`,
      format: 'umd',
      name: pkg.name,
    },
  }),
  Object.assign({}, config, {
    sourcemap: true,
    output: {
      file: `${outputPath}/history.min.js`,
      format: 'umd',
      name: pkg.name,
    },
    plugins: config.plugins.concat([
      minify({
        comments: false,
        sourceMap: true,
        banner,
      }),
    ]),
  }),
];
