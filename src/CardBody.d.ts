import { SvelteComponentTyped } from 'svelte';

export interface ICardBodyProps {
  id?: string;
}

declare class CardBody extends SvelteComponentTyped<ICardBodyProps> {}
export default CardBody;
