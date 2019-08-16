module.exports = {
  setupFilesAfterEnv: [
    '@testing-library/svelte/cleanup-after-each',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.svelte$': 'jest-transform-svelte'
  },
  moduleFileExtensions: ['js', 'svelte'],
  bail: false,
  verbose: false
};
