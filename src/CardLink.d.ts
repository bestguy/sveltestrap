declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface CardLinkProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['a']> {
    /**
     * @default ''
     */
    href?: string;
    class?: string;
  }

  export class CardLink extends SvelteComponent<CardLinkProps, any, any> {}
}
