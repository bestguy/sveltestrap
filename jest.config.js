module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }]
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@popperjs)/)'],
  moduleFileExtensions: ['js', 'svelte'],
  bail: false,
  verbose: false,
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"]
};
