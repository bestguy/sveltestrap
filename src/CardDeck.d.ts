declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface CardDeckProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    class?: string;
  }

  export class CardDeck extends SvelteComponent<CardDeckProps, any, any> {}
}
