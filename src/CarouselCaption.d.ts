import { LocalSvelteComponent } from './shared';

export interface ICarouselCaptionProps {
  id?: string;
  captionHeader?: string;
  captionText: string;
}

declare class CarouselCaption extends LocalSvelteComponent<
  ICarouselCaptionProps
> {}
export default CarouselCaption;
