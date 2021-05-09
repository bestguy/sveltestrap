import { SvelteComponentTyped } from 'svelte';

export interface NavItemProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['li']> {
  active?: boolean;
}

export default class NavItem extends SvelteComponentTyped<
  NavItemProps,
  {},
  { default: {} }
> {}
