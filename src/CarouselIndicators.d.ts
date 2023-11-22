declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface CarouselIndicatorsProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['ol']> {
    activeIndex: number;
    items: any[];
    class?: string;
  }

  export class CarouselIndicators extends SvelteComponent<
    CarouselIndicatorsProps,
    any,
    {}
  > {}
}
