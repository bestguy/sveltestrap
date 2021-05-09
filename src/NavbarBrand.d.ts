import { SvelteComponentTyped } from 'svelte';

export interface NavbarBrandProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['a']> {
  href?: string;
}

export default class NavbarBrand extends SvelteComponentTyped<
  NavbarBrandProps,
  { click: WindowEventMap['click'] },
  { default: {} }
> {}
