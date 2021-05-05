import { SvelteComponentTyped } from 'svelte';

export interface ICarouselCaptionProps {
  captionHeader?: string;
  captionText: string;
}

declare class CarouselCaption extends SvelteComponentTyped<
  ICarouselCaptionProps
> {}
export default CarouselCaption;
