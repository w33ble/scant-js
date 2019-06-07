#!/usr/bin/env node
const rimraf = require('rimraf');
const UseConfig = require('use-config');
const buildHelper = require('.');

const useConfig = new UseConfig({
  name: 'scant-build',
  files: ['package.json', '{name}.config.js', '.{name}rc'],
});

rimraf('dist', err => {
  if (err) {
    console.error(err); // eslint-disable-line no-console
  } else {
    const { config } = useConfig.loadSync();
    buildHelper(config);
  }
});
