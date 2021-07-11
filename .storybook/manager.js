import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';
import pkg from '../package.json';

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: `<span class="d-flex align-items-center justify-content-center" style="display: flex; align-items: center; color: #ae81ff; font-weight: 400; letter-spacing: 0.1rem;">
      <svg height="2em" viewBox="0 0 39.6 45" xmlns="http://www.w3.org/2000/svg" style="margin-right: .5rem"><g transform="translate(2.5, 2.5)"><polyline points="0,30 17.3,40 34.6,30 34.6,20 17.3,30 0,20 0,10 17.3,0 34.6,10 17.3,20 0,10" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></g></svg>
      <div>
        SVELTESTRAP<br />
        <small>${pkg.version}</small>
      </div>
    </span>`,
    brandUrl: 'https://github.com/bestguy/sveltestrap'
  })
});
