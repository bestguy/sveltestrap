import { SvelteComponentTyped } from 'svelte';

export interface ListGroupProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['ul']> {
  flush?: boolean;
  numbered?: boolean;
}

export default class ListGroup extends SvelteComponentTyped<
  ListGroupProps,
  {},
  { default: {} }
> {}
