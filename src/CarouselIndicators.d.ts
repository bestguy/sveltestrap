import { LocalSvelteComponent } from './shared';

export interface ICarouselIndicatorsProps {
  items: any[];
  activeIndex: number;
}

declare class CarouselIndicators extends LocalSvelteComponent<
  ICarouselIndicatorsProps
> {}
export default CarouselIndicators;
