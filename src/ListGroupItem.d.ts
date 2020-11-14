import { LocalSvelteComponent, Color } from './shared';

export interface IListGroupItemProps {
  tag?: string;
  active?: boolean;
  disabled?: boolean;
  color?: Color;
  action?: boolean;
  href?: string;
}

declare class ListGroupItem extends LocalSvelteComponent<IListGroupItemProps> {}
export default ListGroupItem;
