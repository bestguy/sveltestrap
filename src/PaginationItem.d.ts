import { SvelteComponentTyped } from 'svelte';

export interface IPaginationItemProps {
  active?: boolean;
  disabled?: boolean;
}

declare class PaginationItem extends SvelteComponentTyped<
  IPaginationItemProps
> {}
export default PaginationItem;
