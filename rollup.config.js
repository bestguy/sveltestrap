import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import external from 'rollup-plugin-peer-deps-external';
import babel from 'rollup-plugin-babel';

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [{
    file: pkg.main,
    format: 'cjs',
    exports: 'named',
    sourcemap: true,
  }, {
    file: pkg.module,
    format: 'es',
    exports: 'named',
    sourcemap: true,
  }],
  plugins: [
    external(),
    resolve({
      mainFields: ['module', 'jsnext', 'main'],
    }),
    commonjs(),
    svelte({
      include: 'src/**/*.(html|svelte)'
    }),
    babel({
      extensions: ['.js', '.html', '.svelte', '.mjs'],
      "presets": [
        [
          "@babel/preset-env",
        ]
      ]
    }),
  ]
}
