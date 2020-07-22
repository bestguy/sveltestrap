import { LocalSvelteComponent } from './shared';

export interface IDropdownMenuProps {
  right?: boolean;
}

declare class DropdownMenu extends LocalSvelteComponent<IDropdownMenuProps> {}
export default DropdownMenu;
