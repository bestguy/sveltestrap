import { LocalSvelteComponent } from './shared';

export interface ICardLinkProps {
  href?: string;
}

declare class CardLink extends LocalSvelteComponent<ICardLinkProps> {}
export default CardLink;
