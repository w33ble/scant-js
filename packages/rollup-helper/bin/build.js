#!/usr/bin/env node
/* eslint no-global-assign: 0 */

/*
  Usage: scant-build [input]
*/
require = require('@std/esm')(module);
const fs = require('fs');
const path = require('path');
const { build, config } = require('../src/index');

const args = process.argv.slice(2);

const readPkg = cwd => {
  const pkg = fs.readFileSync(path.join(cwd, 'package.json'), 'utf8');
  return JSON.parse(pkg);
};

const getConfig = input => {
  const pkg = readPkg(process.cwd());

  if (input != null) {
    return []
      .concat(config.build(pkg))
      .map(cfg => Object.assign(cfg.inputOptions, { input: args[0] }));
  }

  return config.build(pkg);
};

// build package based on config
build(getConfig(args[0]));
