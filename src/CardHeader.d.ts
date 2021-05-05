import { SvelteComponentTyped } from 'svelte';

export interface ICardHeaderProps {
  id?: string;
  tag?: string;
}

declare class CardHeader extends SvelteComponentTyped<ICardHeaderProps> {}
export default CardHeader;
