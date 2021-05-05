import { SvelteComponentTyped } from 'svelte';

export interface IButtonGroupProps {
  id?: string;
  size?: string;
  vertical?: boolean;
}

declare class ButtonGroup extends SvelteComponentTyped<IButtonGroupProps> {}
export default ButtonGroup;
