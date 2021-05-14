import { SvelteComponentTyped } from 'svelte';

export interface ICardHeaderProps {
  id?: string;
  tag?: 'div' | 'h3';
}

declare class CardHeader extends SvelteComponentTyped<ICardHeaderProps> {}
export default CardHeader;
