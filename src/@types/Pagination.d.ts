import { LocalSvelteComponent } from './shared';

export interface IPaginationProps {
  listClassName?: string;

  size?: string;

  arialabel?: string;
}

declare class Pagination extends LocalSvelteComponent<IPaginationProps> {}
export default Pagination;
