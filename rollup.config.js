import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';

export default {
  entry: 'src/index.js',
  dest: 'dist/sveltestrap.js',
  format: 'cjs',
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
    svelte({
      include: 'src/**/*.html'
    })
  ]
}
