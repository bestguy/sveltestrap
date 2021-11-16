import { DropdownProps } from './Dropdown';
import { SvelteComponentTyped } from 'svelte';

export interface ButtonDropdownProps extends Omit<DropdownProps, 'group'> {}

export default class ButtonDropdown extends SvelteComponentTyped<
  ButtonDropdownProps,
  {},
  {
    default: {};
  }
> {}
