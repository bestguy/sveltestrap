import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import analyze from 'rollup-plugin-analyzer';
import autoPreprocess from 'svelte-preprocess';
import bundleSize from 'rollup-plugin-bundle-size';
import svelte from 'rollup-plugin-svelte';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import pkg from './package.json';
import sveltePreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

const { name } = pkg;

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      name
    },
    {
      file: pkg.main,
      format: 'umd',
      sourcemap: true,
      name
    }
  ],
  plugins: [
    typescript({ sourceMap: !production }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        // generate: production ? 'dom' : 'ssr',
        hydratable: true
      },
      preprocess: sveltePreprocess({
        sourceMap: !production,
        postcss: {
          plugins: [require('autoprefixer')()]
        }
      }),
      emitCss: false
    }),
    resolve(),
    commonjs(),
    production && terser(),
    production && analyze(),
    production && bundleSize()
  ],
  watch: {
    clearScreen: false
  }
};
