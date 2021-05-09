import { SvelteComponentTyped } from 'svelte';

export interface CardGroupProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {}

export default class CardGroup extends SvelteComponentTyped<
  CardGroupProps,
  {},
  { default: {} }
> {}
