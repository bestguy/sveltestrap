declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface CarouselItemProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    activeIndex?: number;
    itemIndex?: number;
    class?: string;
  }

  export class CarouselItem extends SvelteComponent<
    CarouselItemProps,
    any,
    any
  > {}
}
