import { SvelteComponentTyped } from 'svelte';

export interface CarouselControlProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['a']> {
  activeIndex?: number;
  direction: 'prev' | 'next';
  directionText?: string;
  items?: any[];
  wrap?: boolean;
}

export default class CarouselControl extends SvelteComponentTyped<
  CarouselControlProps,
  {},
  {}
> {}
