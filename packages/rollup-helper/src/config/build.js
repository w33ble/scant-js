import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import progress from 'rollup-plugin-progress';
import filesize from 'rollup-plugin-filesize';
import minify from 'rollup-plugin-babel-minify';
import { getBanner, outputPath, basePlugins } from './common';

const config = {
  input: 'src/index.js',
  plugins: basePlugins.concat([
    resolve({
      jsnext: false,
      module: false,
      browser: true,
      preferBuiltins: true,
    }),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
    progress(),
    filesize(),
  ]),
};

export default function getConfig(pkg) {
  const banner = getBanner(pkg);

  return [
    {
      inputOptions: config,
      outputOptions: {
        file: `${outputPath}/history.js`,
        format: 'es',
        name: pkg.name,
      },
    },
    {
      inputOptions: config,
      outputOptions: {
        file: `${outputPath}/history.umd.js`,
        format: 'umd',
        name: pkg.name,
        banner,
        sourcemap: true,
      },
    },
    {
      inputOptions: Object.assign({}, config, {
        plugins: config.plugins.concat([
          minify({
            comments: false,
            sourceMap: true,
            banner,
          }),
        ]),
      }),
      outputOptions: {
        file: `${outputPath}/history.min.js`,
        format: 'umd',
        name: pkg.name,
        sourcemap: true,
      },
    },
  ];
}
