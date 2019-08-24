const path = require('path');

module.exports = async ({ config }) => {
  config.resolve = {
    alias: {
      sveltestrap: path.resolve(__dirname, '../src/')
    },
    extensions: [...config.resolve.extensions, '.svelte']
  };

  return config;
};