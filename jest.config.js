module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }]
  },
  moduleFileExtensions: ['js', 'svelte'],
  bail: false,
  verbose: false
};
