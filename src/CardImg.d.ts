import { SvelteComponentTyped } from 'svelte';

export interface ICardImgProps {
  top?: boolean;
  bottom?: boolean;

  src?: string;
  alt?: string;
}

declare class CardImg extends SvelteComponentTyped<ICardImgProps> {}
export default CardImg;
