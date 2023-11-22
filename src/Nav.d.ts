declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface NavProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['ul']> {
    card?: boolean;
    fill?: boolean;
    horizontal?: string;
    justified?: boolean;
    navbar?: boolean;
    pills?: boolean;
    tabs?: boolean;
    vertical?: boolean | string;
    underline?: boolean;
    class?: string;
  }

  export class Nav extends SvelteComponent<NavProps, any, any> {}
}
