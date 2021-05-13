import { SvelteComponentTyped } from 'svelte';

export interface CardTextProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['p']> {}

export default class CardText extends SvelteComponentTyped<
  CardTextProps,
  {},
  { default: {} }
> {}
