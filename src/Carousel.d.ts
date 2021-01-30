import { LocalSvelteComponent } from './shared';

export interface ICarouselProps {
  id?: string;
  style?: string;
  items: any[];
  activeIndex?: number;
  next: () => void;
  previous: () => void;
  keyboard?: boolean;
  pause?: 'hover' | false;
  ride?: 'carousel';
  interval?: number | string | boolean;
  mouseEnter?: () => void;
  mouseExit?: () => void;
  slide?: boolean;
  enableTouch?: boolean;
}

declare class Carousel extends LocalSvelteComponent<ICarouselProps> {}
export default Carousel;
