import { SvelteComponentTyped } from 'svelte';

export interface IListGroupProps {
  flush?: boolean;
}

declare class ListGroup extends SvelteComponentTyped<IListGroupProps> {}
export default ListGroup;
