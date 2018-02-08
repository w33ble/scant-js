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
  if (typeof obj !== 'object')
    throw new Error('Package configuration must be passed into the rollup config creator');
  keys.forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(obj, key))
      throw new Error(`Package object must contain property '${key}'`);
  });
};

const getBabelConfig = ({ targets, include, exclude }) => ({
  babelrc: false,
  plugins: [
    'external-helpers',
    'transform-object-rest-spread',
    'transform-async-to-promises',
    'transform-class-properties',
  ],
  presets: [setBabelEnvPreset(targets)],
  include,
  exclude,
});

const parseOptions = (pkg, opts) => ({
  format: opts.format || 'es',
  minify: Boolean(opts.minify),
  outputSuffix: opts.outputSuffix || '',
  external: opts.external === true ? Object.keys(pkg.dependencies || {}) : opts.external || [],
  globals: opts.globals || {},
  babel: {
    targets: opts.babel.targets || { browsers: 'defaults' },
    include: opts.babel.include || ['src/**'],
    exclude: opts.babel.exclude || [],
  },
});

export const outputPath = 'dist';

export const getBanner = pkg => `/*
  ${pkg.name} @ ${pkg.version}
  License: ${pkg.license}
  Built: ${new Date().toISOString()}
*/`;

export const getBuildConfig = (pkg, opts = {}) => {
  verifyProps(pkg, ['name', 'version', 'license']);

  const banner = getBanner(pkg);
  const basename = getBasename(pkg.name);
  const options = parseOptions(pkg, opts);
  const babelConfig = getBabelConfig(options.babel);

  const config = {
    input: 'src/index.js',
    external: options.external,
    plugins: [
      json(),
      resolve({
        main: true,
        module: true,
        jsnext: true,
        browser: false,
        preferBuiltins: true,
      }),
      babel(babelConfig),
      commonjs(),
      builtins(),
      globals(),
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
      globals: options.globals,
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
  const options = parseOptions(pkg, opts);
  const babelConfig = getBabelConfig(options.babel);

  return {
    // input: 'src/index.js',
    // external: options.external,
    plugins: [
      json(),
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
      commonjs(),
      builtins(),
      globals(),
    ],
    output: {
      format: 'iife',
      name: basename,
      sourcemap: 'inline',
    },
  };
};
