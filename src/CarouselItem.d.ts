import { SvelteComponentTyped } from 'svelte';

export interface ICarouselItemProps {
  itemIndex?: number;
  activeIndex?: number;
}

declare class CarouselItem extends SvelteComponentTyped<ICarouselItemProps> {}
export default CarouselItem;
