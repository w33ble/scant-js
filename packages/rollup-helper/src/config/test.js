import { getTestConfig } from './rollup';

export default function getConfig(pkg) {
  return getTestConfig(pkg, {
    babel: {
      targets: 'ie >= 11, safari >= 11',
    },
  });
}
