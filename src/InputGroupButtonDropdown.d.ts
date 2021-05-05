import { IDropdownProps } from './Dropdown';
import { SvelteComponentTyped } from 'svelte';

export interface IInputGroupButtonDropdownProps extends IDropdownProps {
  addonType: 'prepend' | 'append';
}

declare class InputGroupButtonDropdown extends SvelteComponentTyped<
  IInputGroupButtonDropdownProps
> {}
export default InputGroupButtonDropdown;
