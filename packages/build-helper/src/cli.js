#!/usr/bin/env node
import rimraf from 'rimraf';
import UseConfig from 'use-config';
import build from '.';

const useConfig = new UseConfig({
  name: 'scant-build',
  files: ['package.json', '{name}.config.js', '.{name}rc'],
});

rimraf('dist', err => {
  if (err) {
    console.error(err); // eslint-disable-line no-console
  } else {
    const { config } = useConfig.loadSync();
    build(config);
  }
});
