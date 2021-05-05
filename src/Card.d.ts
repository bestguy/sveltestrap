import { SvelteComponentTyped } from 'svelte';
import { Color } from './shared';

export interface ICardProps {
  id?: string;
  inverse?: boolean;
  color?: Color;
  body?: boolean;
  outline?: boolean;
  style?: string;
}

declare class Card extends SvelteComponentTyped<ICardProps> {}
export default Card;
