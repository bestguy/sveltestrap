import { LocalSvelteComponent } from './shared';

export interface ICarouselCaptionProps {
  captionHeader?: string;
  captionText: string;
}

declare class CarouselCaption extends LocalSvelteComponent<
  ICarouselCaptionProps
> {}
export default CarouselCaption;
