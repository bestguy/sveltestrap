declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface CarouselControlProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['a']> {
  activeIndex?: number;
  direction: 'prev' | 'next';
  directionText?: string;
  items?: any[];
  wrap?: boolean;
class?: string;
}

export class CarouselControl extends SvelteComponent<
  CarouselControlProps,
  any,
  {}
> {}

}
