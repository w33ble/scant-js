import { getBuildConfig } from './rollup';

export default function getConfig(pkg) {
  const defaultTargets = {
    browsers: 'last 2 Chrome versions, last 2 Firefox versions, safari >= 11, edge >= 15',
  };

  const config = [
    getBuildConfig(pkg, {
      format: 'es',
      babel: {
        targets: {
          browsers: '> 5%, last 2 Chrome versions, last 2 Firefox versions',
        },
      },
    }),
    getBuildConfig(pkg, {
      format: 'umd',
      outputSuffix: '.legacy',
      minify: true,
      babel: {
        targets: {
          browsers: 'ie >= 9, last 2 Safari versions',
        },
      },
    }),
    getBuildConfig(pkg, {
      format: 'umd',
      outputSuffix: '.umd',
      babel: { targets: defaultTargets },
    }),
    getBuildConfig(pkg, {
      format: 'umd',
      outputSuffix: '.min',
      minify: true,
      babel: { targets: defaultTargets },
    }),
  ];

  return config;
}
