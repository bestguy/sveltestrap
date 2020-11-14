import { IDropdownProps } from './Dropdown';
import { LocalSvelteComponent } from './shared';

export interface IInputGroupButtonDropdownProps extends IDropdownProps {
  addonType: 'prepend' | 'append';
}

declare class InputGroupButtonDropdown extends LocalSvelteComponent<
  IInputGroupButtonDropdownProps
> {}
export default InputGroupButtonDropdown;
