import { UncontrolledDropdownProps, IDropdownProps } from './Dropdown';
import { LocalSvelteComponent } from './shared';
export {
  UncontrolledDropdownProps as UncontrolledButtonDropdownProps,
  IDropdownProps as ButtonDropdownProps
};

declare class ButtonDropdown extends LocalSvelteComponent<IDropdownProps> {}
export default ButtonDropdown;
