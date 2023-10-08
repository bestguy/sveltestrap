declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface CarouselProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  activeIndex?: number;
  interval?: number | string | boolean;
  items: any[];
  keyboard?: boolean;
  pause?: 'hover' | false;
  ride?: boolean;
class?: string;
}

export class Carousel extends SvelteComponent<
  CarouselProps,
  any,
  any
> {}

}
