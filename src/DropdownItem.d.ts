import { LocalSvelteComponent } from './shared';

export interface IDropdownItemProps {
  active?: boolean;
  disabled?: boolean;
  divider?: boolean;
  header?: boolean;
  href?: string;
  toggle?: boolean;
}

declare class DropdownItem extends LocalSvelteComponent<IDropdownItemProps> {}
export default DropdownItem;
