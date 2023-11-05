declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface CardColumnsProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    class?: string;
  }

  export class CardColumns extends SvelteComponent<
    CardColumnsProps,
    any,
    any
  > {}
}
