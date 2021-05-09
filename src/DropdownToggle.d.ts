import { SvelteComponentTyped } from 'svelte';
import { IButtonProps } from './Button'

export interface IDropdownToggleProps extends IButtonProps {
  caret?: boolean;
  split?: boolean;
  tag?: 'a' | 'div' | 'span';
  nav?: boolean;
}

declare class DropdownToggle extends SvelteComponentTyped<
  IDropdownToggleProps
> {}
export default DropdownToggle;
