import { SvelteComponentTyped } from 'svelte';
import { Direction } from './shared';

export interface DropdownProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  direction?: Direction;
  group?: boolean;
  isOpen?: boolean;
  nav?: boolean;
  active?: boolean;
  addonType?: boolean | 'prepend' | 'append'; // TODO?
  size?: string;
  toggle?: () => void;
  inNavbar?: boolean;
  setActiveFromChild?: boolean;
  dropup?: boolean;
}

export default class Dropdown extends SvelteComponentTyped<
  DropdownProps,
  {},
  { default: {} }
> {}
