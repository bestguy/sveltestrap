import { SvelteComponentTyped } from 'svelte';

export interface IButtonToolbarProps {
  'aria-label'?: string;
}

declare class ButtonToolbar extends SvelteComponentTyped<IButtonToolbarProps> {}
export default ButtonToolbar;
