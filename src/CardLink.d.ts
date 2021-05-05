import { SvelteComponentTyped } from 'svelte';

export interface ICardLinkProps {
  href?: string;
}

declare class CardLink extends SvelteComponentTyped<ICardLinkProps> {}
export default CardLink;
