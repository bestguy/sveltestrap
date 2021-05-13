import { SvelteComponentTyped } from 'svelte';

export interface CardTitleProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['h5']> {}

export default class CardTitle extends SvelteComponentTyped<
  CardTitleProps,
  {},
  { default: {} }
> {}
