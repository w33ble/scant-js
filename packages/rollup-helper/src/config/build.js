import merge from 'lodash.merge';
import { getBuildConfig } from './rollup';

export default function getConfig(pkg, opts = {}) {
  const defaultTargets = {
    browsers: 'last 2 Chrome versions, last 2 Firefox versions, safari >= 11, edge >= 15',
  };

  const mergeConfigs = obj => merge({}, opts, obj);

  const config = [
    getBuildConfig(
      pkg,
      mergeConfigs({
        format: 'es',
        babel: {
          targets: {
            browsers: '> 5%, last 2 Chrome versions, last 2 Firefox versions',
          },
        },
      })
    ),
    getBuildConfig(
      pkg,
      mergeConfigs({
        format: 'umd',
        outputSuffix: '.legacy',
        minify: true,
        babel: {
          targets: {
            browsers: 'ie >= 9, last 2 Safari versions',
          },
        },
      })
    ),
    getBuildConfig(
      pkg,
      mergeConfigs({
        format: 'umd',
        outputSuffix: '.umd',
        babel: { targets: defaultTargets },
      })
    ),
    getBuildConfig(
      pkg,
      mergeConfigs({
        format: 'umd',
        outputSuffix: '.min',
        minify: true,
        babel: { targets: defaultTargets },
      })
    ),
  ];

  return config;
}
