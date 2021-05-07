import { SvelteComponentTyped } from 'svelte';

export interface ICarouselProps {
  activeIndex?: number;
  dark?: boolean;
  interval?: number | string | boolean;
  items: any[];
  keyboard?: boolean;
  pause?: 'hover' | false;
  ride?: boolean;
  style?: string;
}

declare class Carousel extends SvelteComponentTyped<ICarouselProps> {}
export default Carousel;
