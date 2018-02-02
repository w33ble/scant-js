import { getTestConfig } from './rollup';

export default function getConfig(pkg, opts = {}) {
  const mergeConfigs = obj => Object.assign({}, opts, obj);

  return getTestConfig(
    pkg,
    mergeConfigs({
      babel: {
        targets: 'ie >= 11, safari >= 11',
      },
    })
  );
}
