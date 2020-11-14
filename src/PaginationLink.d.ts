import { LocalSvelteComponent } from './shared';

export interface IPaginationLinkProps {
  arialabel?: string;

  next?: boolean;
  previous?: boolean;
  first?: boolean;
  last?: boolean;
  href?: string;
}

declare class PaginationLink extends LocalSvelteComponent<
  IPaginationLinkProps
> {}
export default PaginationLink;
