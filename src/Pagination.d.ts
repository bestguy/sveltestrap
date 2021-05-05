import { SvelteComponentTyped } from 'svelte';

export interface IPaginationProps {
  listClassName?: string;

  size?: string;

  arialabel?: string;
}

declare class Pagination extends SvelteComponentTyped<IPaginationProps> {}
export default Pagination;
