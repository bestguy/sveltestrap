import { SvelteComponentTyped } from 'svelte';

export interface CarouselProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  activeIndex?: number;
  dark?: boolean;
  interval?: number | string | boolean;
  items: any[];
  keyboard?: boolean;
  pause?: 'hover' | false;
  ride?: boolean;
  style?: string;
  fluid?: boolean;
}

export default class Carousel extends SvelteComponentTyped<
  CarouselProps,
  {},
  { default: {} }
> {}
