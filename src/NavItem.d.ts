declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface NavItemProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['li']> {
    active?: boolean;
    class?: string;
  }

  export class NavItem extends SvelteComponent<NavItemProps, any, any> {}
}
