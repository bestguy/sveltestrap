declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface NavLinkProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['a']> {
  disabled?: boolean;
  active?: boolean;
  href?: string;
class?: string;
}

export class NavLink extends SvelteComponent<
  NavLinkProps,
  { click: WindowEventMap['click'] },
  any
> {}

}
