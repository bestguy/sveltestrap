import { DropdownProps } from './Dropdown';
import { SvelteComponentTyped } from 'svelte';

export interface InputGroupButtonDropdownProps extends DropdownProps {
  addonType: 'prepend' | 'append'; // TODO not used in v5
}

export default class InputGroupButtonDropdown extends SvelteComponentTyped<
  InputGroupButtonDropdownProps,
  {},
  { default: {} }
> {}
