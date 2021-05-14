import { SvelteComponentTyped } from 'svelte';

export interface NavLinkProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['a']> {
  disabled?: boolean;
  active?: boolean;
  href?: string;
}

export default class NavLink extends SvelteComponentTyped<
  NavLinkProps,
  { click: WindowEventMap['click'] },
  { default: {} }
> {}
