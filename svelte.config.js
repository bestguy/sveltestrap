// config file for the svelte for vscode extension, prevents false syntax errors
// install the lib first
const preprocess = require('svelte-preprocess');

module.exports = {
  preprocess: preprocess(),
  // ...other svelte options
};
