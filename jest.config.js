export default {
  testEnvironment: "jsdom",
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }],
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  extensionsToTreatAsEsm: [ '.svelte', '.ts' ],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@popperjs)/)'],
  moduleFileExtensions: ['ts', 'js', 'svelte'],
  bail: false,
  verbose: false
};
