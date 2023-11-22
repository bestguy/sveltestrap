declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface CardImgOverlayProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    class?: string;
  }

  export class CardImgOverlay extends SvelteComponent<
    CardImgOverlayProps,
    any,
    any
  > {}
}
