/** @type { import('@storybook/svelte-vite').StorybookConfig } */
export default {
  stories: ['../stories/index.stories.ts'], 
  // stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx|svelte)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  features: {
    // TODO: migrate
    // https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#storystorev7-enabled-by-default
    storyStoreV7: false,
  },

  framework: {
    name: '@storybook/svelte-webpack5',
    options: {}
  },

  docs: {
    autodocs: "tag"
  }
};
