import { LocalSvelteComponent } from './shared';

export interface ICarouselIndicatorsProps {
  items: object[];
  activeIndex: number;
  id?: string;
}

declare class CarouselIndicators extends LocalSvelteComponent<
  ICarouselIndicatorsProps
> {}
export default CarouselIndicators;
