import { LocalSvelteComponent } from './shared';

export interface IPaginationItemProps {
  active?: boolean;
  disabled?: boolean;
}

declare class PaginationItem extends LocalSvelteComponent<
  IPaginationItemProps
> {}
export default PaginationItem;
