import { SvelteComponentTyped } from 'svelte';

export interface CarouselProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  activeIndex?: number;
  interval?: number | string | boolean;
  items: any[];
  keyboard?: boolean;
  pause?: 'hover' | false;
  ride?: boolean;
  style?: string;
}

export default class Carousel extends SvelteComponentTyped<
  CarouselProps,
  {},
  { default: {} }
> {}
