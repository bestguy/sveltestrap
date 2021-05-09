import { SvelteComponentTyped } from 'svelte';
import { ButtonProps } from './Button';
import { Color } from './shared';

export interface DropdownToggleProps extends ButtonProps {
  caret?: boolean;
  color?: Color;
  disabled?: boolean;
  outline?: boolean;
  ariaHaspopup?: boolean;
  ariaLabel?: string;
  split?: boolean;
  tag?: string;
  nav?: boolean;

  size?: string;
}

declare class DropdownToggle extends SvelteComponentTyped<
  IDropdownToggleProps
> {}
export default DropdownToggle;
