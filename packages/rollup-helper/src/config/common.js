import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

export const outputPath = 'dist';

export const getBanner = pkg => `/*
${pkg.name} @ ${pkg.version}
License: ${pkg.license}
Built: ${new Date().toISOString()}
*/`;

export const basePlugins = [json(), commonjs(), builtins(), globals()];
