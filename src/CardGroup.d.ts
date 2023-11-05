declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface CardGroupProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    class?: string;
  }

  export class CardGroup extends SvelteComponent<CardGroupProps, any, any> {}
}
