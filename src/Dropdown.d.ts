import { Direction, LocalSvelteComponent } from './shared';

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

declare class Dropdown extends LocalSvelteComponent<IDropdownProps> {}

export default Dropdown;
