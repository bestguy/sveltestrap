import { SvelteComponentTyped } from 'svelte';
import { ButtonProps } from './Button';
import { Color } from './shared';

export interface DropdownToggleProps extends ButtonProps {
  caret?: boolean;
  split?: boolean;
  tag?: 'a' | 'div' | 'span';
  nav?: boolean;
}

declare class DropdownToggle extends SvelteComponentTyped<IDropdownToggleProps> {}
export default DropdownToggle;
