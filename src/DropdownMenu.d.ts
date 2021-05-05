import { SvelteComponentTyped } from 'svelte';

export interface IDropdownMenuProps {
  dark?: boolean;
  end?: boolean;
  right?: boolean;
}

declare class DropdownMenu extends SvelteComponentTyped<IDropdownMenuProps> {}
export default DropdownMenu;
