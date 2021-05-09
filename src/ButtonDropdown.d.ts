import { DropdownProps } from './Dropdown';
import { SvelteComponentTyped } from 'svelte';

export interface ButtonDropdownProps
  extends Omit<IDropdownProps, 'group'> {}

export default class Modal extends ButtonDropdown<
  ButtonDropdownProps,
  {},
  {
    default: {}
  }
> {}