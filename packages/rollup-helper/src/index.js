import { rollup } from 'rollup';
import buildConfig from './config/build';
import testConfig from './config/test';

export const config = {
  build: buildConfig,
  test: testConfig,
};

function writeBuild(inputOptions, outputOptions) {
  return rollup(inputOptions).then(bundle => bundle.write(outputOptions));
}

export function build(buildCfg) {
  // create a bundle
  if (!Array.isArray(buildCfg)) {
    return writeBuild(buildCfg.inputOptions, buildCfg.outputOptions);
  }

  return buildCfg
    .reduce(
      (chain, cfg) => chain.then(() => writeBuild(cfg.inputOptions, cfg.outputOptions)),
      Promise.resolve()
    )
    .catch(err => console.error(err));
}
