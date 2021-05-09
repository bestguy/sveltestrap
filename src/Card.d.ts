import { SvelteComponentTyped } from 'svelte';
import { Color } from './shared';

export interface CardProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  id?: string;
  inverse?: boolean;
  color?: Color;
  body?: boolean;
  outline?: boolean;
  style?: string;
}

export default class Card extends SvelteComponentTyped<
  CardProps,
  { click: WindowEventMap['click'] },
  { default: {} }
> {}
