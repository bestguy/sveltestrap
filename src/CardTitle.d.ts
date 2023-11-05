declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface CardTitleProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['h5']> {
    class?: string;
  }

  export class CardTitle extends SvelteComponent<CardTitleProps, any, any> {}
}
