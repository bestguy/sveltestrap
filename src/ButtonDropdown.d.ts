import { IDropdownProps } from './Dropdown';
import { SvelteComponentTyped } from 'svelte';
export { IDropdownProps as ButtonDropdownProps };

declare class ButtonDropdown extends SvelteComponentTyped<Omit<IDropdownProps, 'group'>> {}
export default ButtonDropdown;
