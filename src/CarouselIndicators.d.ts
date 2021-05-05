import { SvelteComponentTyped } from 'svelte';

export interface ICarouselIndicatorsProps {
  items: any[];
  activeIndex: number;
}

declare class CarouselIndicators extends SvelteComponentTyped<
  ICarouselIndicatorsProps
> {}
export default CarouselIndicators;
