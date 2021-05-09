import { SvelteComponentTyped } from 'svelte';

export interface CardBodyProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> { }

export default class CardBody extends SvelteComponentTyped<
  CardBodyProps,
  {},
  { default: {} }
> {}
