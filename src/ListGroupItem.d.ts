import { SvelteComponentTyped } from 'svelte';
import { Color } from './shared';

export interface IListGroupItemProps {
  tag?: string;
  active?: boolean;
  disabled?: boolean;
  color?: Color;
  action?: boolean;
  href?: string;
}

declare class ListGroupItem extends SvelteComponentTyped<IListGroupItemProps> {}
export default ListGroupItem;
