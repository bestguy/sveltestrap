import { SvelteComponentTyped } from 'svelte';
import { BackgroundColor } from './shared';

export interface NavbarProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['nav']> {
  color?: BackgroundColor;
  dark?: boolean;
  expand?: boolean | string;
  fixed?: string;
  light?: boolean;
  sticky?: string;
}

export default class Navbar extends SvelteComponentTyped<
  NavbarProps,
  {},
  { default: {} }
> {}
