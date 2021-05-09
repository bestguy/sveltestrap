import { SvelteComponentTyped } from 'svelte';

export interface CarouselCaptionProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  captionHeader?: string;
  captionText: string;
}

export default class CarouselCaption extends SvelteComponentTyped<
  CarouselCaptionProps,
  {},
  { default: {} }
> {}
