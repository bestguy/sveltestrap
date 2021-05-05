import { SvelteComponentTyped } from 'svelte';

export interface IDropdownItemProps {
  active?: boolean;
  disabled?: boolean;
  divider?: boolean;
  header?: boolean;
  href?: string;
  toggle?: boolean;
}

declare class DropdownItem extends SvelteComponentTyped<IDropdownItemProps> {}
export default DropdownItem;
