import { SvelteComponentTyped } from 'svelte';
import { Direction } from './shared';

export interface IDropdownProps {
  direction?: Direction;
  group?: boolean;
  isOpen?: boolean;
  nav?: boolean;
  active?: boolean;
  addonType?: boolean | 'prepend' | 'append';
  size?: string;

  toggle?: () => void;

  inNavbar?: boolean;
  setActiveFromChild?: boolean;
  dropup?: boolean;
}

declare class Dropdown extends SvelteComponentTyped<IDropdownProps> {}

export default Dropdown;
