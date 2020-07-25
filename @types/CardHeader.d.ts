import { LocalSvelteComponent } from './shared';

export interface ICardHeaderProps {
  id?: string;
  tag?: string;
}

declare class CardHeader extends LocalSvelteComponent<ICardHeaderProps> {}
export default CardHeader;
