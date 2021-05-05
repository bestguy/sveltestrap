import { SvelteComponentTyped } from 'svelte';

export interface ICarouselProps {
  style?: string;
  items: any[];
  activeIndex?: number;
  keyboard?: boolean;
  pause?: 'hover' | false;
  interval?: number | string | boolean;
}

declare class Carousel extends SvelteComponentTyped<ICarouselProps> {}
export default Carousel;
