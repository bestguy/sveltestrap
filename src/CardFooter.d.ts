import { SvelteComponentTyped } from 'svelte';

export interface CardFooterProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {}

export default class CardFooter extends SvelteComponentTyped<
  CardFooterProps,
  {},
  { default: {} }
> {}
