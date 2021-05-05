import { SvelteComponentTyped } from 'svelte';

export interface IPaginationLinkProps {
  arialabel?: string;

  next?: boolean;
  previous?: boolean;
  first?: boolean;
  last?: boolean;
  href?: string;
}

declare class PaginationLink extends SvelteComponentTyped<
  IPaginationLinkProps
> {}
export default PaginationLink;
