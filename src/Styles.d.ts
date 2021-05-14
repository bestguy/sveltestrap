import { SvelteComponentTyped } from 'svelte';

export interface StylesProps {
  icons?: boolean;
}

export default class Styles extends SvelteComponentTyped<
  StylesProps,
  {},
  {}
> {}
