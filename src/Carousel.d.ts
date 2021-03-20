import { LocalSvelteComponent } from './shared';

export interface ICarouselProps {
  style?: string;
  items: any[];
  activeIndex?: number;
  keyboard?: boolean;
  pause?: 'hover' | false;
  interval?: number | string | boolean;
}

declare class Carousel extends LocalSvelteComponent<ICarouselProps> {}
export default Carousel;
