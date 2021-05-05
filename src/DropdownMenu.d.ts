import { SvelteComponentTyped } from 'svelte';

export interface IDropdownMenuProps {
  right?: boolean;
}

declare class DropdownMenu extends SvelteComponentTyped<IDropdownMenuProps> {}
export default DropdownMenu;
