import { LocalSvelteComponent } from './shared';

export interface ICarouselControlProps {
  id?: string;
  direction: 'prev' | 'next';
  directionText: string;
  activeIndex?: number;
  items?: any[];
  wrap?: boolean;
}

export default class CarouselControl extends LocalSvelteComponent<
  ICarouselControlProps
> {}
