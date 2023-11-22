declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface CardSubtitleProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['h6']> {
    class?: string;
  }

  export class CardSubtitle extends SvelteComponent<
    CardSubtitleProps,
    any,
    any
  > {}
}
