export default {
  stories: ['../stories/index.stories.ts'], 

  features: {
    storyStoreV7: false,
  },

  framework: {
    name: '@storybook/svelte-webpack5',
    options: {}
  },

  docs: {
    autodocs: false
  }
};
