import { Color, LocalSvelteComponent } from './shared';

export interface ICardProps {
  id?: string;
  inverse?: boolean;
  color?: Color;
  body?: boolean;
  outline?: boolean;
  style?: string;
}

declare class Card extends LocalSvelteComponent<ICardProps> {}
export default Card;
