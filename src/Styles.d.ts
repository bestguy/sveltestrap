import { SvelteComponentTyped } from 'svelte';

export interface StylesProps {
  icons?: boolean;
  theme?: 'light' | 'dark' | 'auto' | undefined;
}

export default class Styles extends SvelteComponentTyped<StylesProps, {}, {}> {}
