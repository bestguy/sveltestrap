import { LocalSvelteComponent } from './shared';

export interface ICarouselItemProps {
  itemIndex?: number;
  activeIndex?: number;
}

declare class CarouselItem extends LocalSvelteComponent<ICarouselItemProps> {}
export default CarouselItem;
