import istanbul from '@w33ble/rollup-plugin-istanbul';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import resolve from 'rollup-plugin-node-resolve';
import progress from 'rollup-plugin-progress';
import filesize from 'rollup-plugin-filesize';
import minify from 'rollup-plugin-babel-minify';

const setBabelEnvPreset = targets => ['env', { modules: false, targets }];

const getBasename = name => name.replace('@scant/', '');

const verifyProps = (obj, keys) => {
  keys.forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(obj, key))
      throw new Error(`Package object must contain property '${key}'`);
  });
};

const getBabelConfig = ({ targets, include, exclude }) => ({
  babelrc: false,
  plugins: ['external-helpers'],
  presets: [setBabelEnvPreset(targets)],
  include,
  exclude,
});

export const outputPath = 'dist';

export const getBanner = pkg => `/*
  ${pkg.name} @ ${pkg.version}
  License: ${pkg.license}
  Built: ${new Date().toISOString()}
*/`;

export const getBuildConfig = (pkg, opts = {}) => {
  verifyProps(pkg, ['name', 'version', 'license']);

  const dependencies = Object.keys(pkg.dependencies || {});
  const banner = getBanner(pkg);
  const basename = getBasename(pkg.name);
  const options = {
    format: opts.format || 'es',
    minify: Boolean(opts.minify),
    outputSuffix: opts.outputSuffix || '',
    external: opts.external === true ? dependencies : opts.external || [],
    babel: {
      targets: opts.babel.targets || { browsers: 'defaults' },
      include: opts.babel.include || ['src/**'],
      exclude: opts.babel.exclude || [],
    },
  };

  const babelConfig = getBabelConfig(options.babel);

  const config = {
    input: 'src/index.js',
    external: options.external,
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
      babel(babelConfig),
      progress(),
      filesize(),
    ],
  };

  if (options.minify) {
    config.plugins = config.plugins.concat(
      minify({
        comments: false,
        sourceMap: true,
        banner,
      })
    );
  }

  return {
    inputOptions: config,
    outputOptions: {
      file: `${outputPath}/${basename}${options.outputSuffix}.js`,
      format: options.format,
      name: pkg.name,
      banner,
    },
  };
};

export const getTestConfig = (pkg, opts = {}) => {
  verifyProps(pkg, ['name']);

  const basename = getBasename(pkg.name);
  const dependencies = Object.keys(pkg.dependencies || {});
  const options = {
    external: opts.external === true ? dependencies : opts.external || [],
    babel: {
      targets: opts.babel.targets || { browsers: 'defaults' },
      include: opts.babel.include || ['src/**'],
      exclude: opts.babel.exclude || [],
    },
  };

  const babelConfig = getBabelConfig(options);

  return {
    // input: 'src/index.js',
    external: options.external,
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
      babel(babelConfig),
    ],
    output: {
      format: 'iife',
      name: basename,
      sourcemap: 'inline',
    },
  };
};
