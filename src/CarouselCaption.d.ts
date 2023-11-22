declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface CarouselCaptionProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    captionHeader?: string;
    captionText: string;
    class?: string;
  }

  export class CarouselCaption extends SvelteComponent<
    CarouselCaptionProps,
    any,
    any
  > {}
}
