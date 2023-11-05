declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';
  import type { BackgroundColor } from './shared.d.ts';

  export interface NavbarProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['nav']> {
    color?: BackgroundColor;
    container?: boolean | 'fluid'; // TODO also sm-xxl?
    dark?: boolean;
    expand?: boolean | string;
    fixed?: string;
    light?: boolean;
    sticky?: string;
    class?: string;
  }

  export class Navbar extends SvelteComponent<NavbarProps, any, any> {}
}
