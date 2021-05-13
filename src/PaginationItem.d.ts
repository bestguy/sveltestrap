import { SvelteComponentTyped } from 'svelte';

export interface PaginationItemProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['li']> {
  active?: boolean;
  disabled?: boolean;
}

export default class PaginationItem extends SvelteComponentTyped<
  PaginationItemProps,
  {},
  { default: {} }
> {}
