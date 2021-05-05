import { SvelteComponentTyped } from 'svelte';

export interface ICarouselControlProps {
  direction: 'prev' | 'next';
  directionText?: string;
  activeIndex?: number;
  items?: any[];
  wrap?: boolean;
}

export default class CarouselControl extends SvelteComponentTyped<
  ICarouselControlProps
> {}
