import { SvelteComponentTyped } from 'svelte';

export interface ColgroupProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['colgroup']> {
  footer?: undefined;
  header?: undefined;
  width?: undefined;
}

export default class Colgroup extends SvelteComponentTyped<
ColgroupProps,
  {},
  { default: {} }
> {}
