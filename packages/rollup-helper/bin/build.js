#!/usr/bin/env node
/* eslint no-global-assign: 0 */

/*
  Usage: scant-build [entry] [--ext external,dependencies]
*/
const fs = require('fs');
const path = require('path');
const mri = require('mri');
const { build, configs } = require('..');

// argument parsing
const cliArgs = mri(process.argv.slice(2), {
  alias: { ext: ['external'] },
  default: { ext: [] },
});
const entryFile = cliArgs._[0];

// helper functions
const splitArgs = args => args.split(',');

const parseArgs = args =>
  Array.isArray(args) ? args.reduce((acc, arg) => acc.concat(splitArgs(arg)), []) : splitArgs(args);

const readPkg = cwd => {
  const pkg = fs.readFileSync(path.join(cwd, 'package.json'), 'utf8');
  return JSON.parse(pkg);
};

// get the build config
const getConfig = (input, { external }) => {
  const pkg = readPkg(process.cwd());
  const getBuildConfig = () => configs.build(pkg, { external });

  if (input != null) {
    return [].concat(getBuildConfig()).map(cfg => Object.assign(cfg.inputOptions, { input }));
  }

  return getBuildConfig();
};

// build package based on config
build(getConfig(entryFile, { external: parseArgs(cliArgs.external) }));
