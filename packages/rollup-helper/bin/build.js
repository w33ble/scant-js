#!/usr/bin/env node
/* eslint no-global-assign: 0 */

/*
  Usage: scant-build [input]
*/
require = require('@std/esm')(module);
const fs = require('fs');
const path = require('path');
const mri = require('mri');
const { build, configs } = require('../src/index');

const splitArgs = args => args.split(',');

const parseArgs = args =>
  Array.isArray(args) ? args.reduce((acc, arg) => acc.concat(splitArgs(arg)), []) : splitArgs(args);

const args = mri(process.argv.slice(2), {
  alias: { ext: ['external'] },
  default: { ext: [] },
});

const readPkg = cwd => {
  const pkg = fs.readFileSync(path.join(cwd, 'package.json'), 'utf8');
  return JSON.parse(pkg);
};

const getConfig = (input, { external }) => {
  const pkg = readPkg(process.cwd());
  const getBuildConfig = () => configs.build(pkg, { external });

  if (input != null) {
    return [].concat(getBuildConfig()).map(cfg => Object.assign(cfg.inputOptions, { input }));
  }

  return getBuildConfig();
};

// build package based on config
build(getConfig(args._[0], { external: parseArgs(args.external) }));
