import { LocalSvelteComponent } from './shared';

export interface ICarouselControlProps {
  direction: 'prev' | 'next';
  directionText?: string;
  activeIndex?: number;
  items?: any[];
  wrap?: boolean;
}

export default class CarouselControl extends LocalSvelteComponent<
  ICarouselControlProps
> {}
