declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface NavbarBrandProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['a']> {
  href?: string;
class?: string;
}

export class NavbarBrand extends SvelteComponent<
  NavbarBrandProps,
  { click: WindowEventMap['click'] },
  any
> {}

}
