const path = require('path');
const autoPreprocess = require('svelte-preprocess');

module.exports = async ({ config }) => {
  const svelteLoader = config.module.rules.find(
    (r) => r.loader && r.loader.includes('svelte-loader')
  );
  svelteLoader.options.preprocess = autoPreprocess({
    typescript: {
      tsconfigFile: './tsconfig.json',
      transpileOnly: true
    }
  });

  config.resolve = {
    alias: {
      sveltestrap: path.resolve(__dirname, '../src/')
    },
    extensions: [...config.resolve.extensions, '.svelte', '.ts']
  };

  return config;
};
