import { IDropdownProps } from './Dropdown';
import { LocalSvelteComponent } from './shared';
export { IDropdownProps as ButtonDropdownProps };

declare class ButtonDropdown extends LocalSvelteComponent<Omit<IDropdownProps, 'group'>> {}
export default ButtonDropdown;
