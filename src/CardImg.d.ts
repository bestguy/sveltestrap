import { LocalSvelteComponent } from './shared';

export interface ICardImgProps {
  top?: boolean;
  bottom?: boolean;

  src?: string;
  alt?: string;
}

declare class CardImg extends LocalSvelteComponent<ICardImgProps> {}
export default CardImg;
