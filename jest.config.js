module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.svelte$': 'jest-transform-svelte'
  },
  moduleFileExtensions: ['js', 'svelte'],
  bail: false,
  verbose: false
};
