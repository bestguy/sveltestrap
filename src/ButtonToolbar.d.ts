import { LocalSvelteComponent } from './shared';

export interface IButtonToolbarProps {
  'aria-label'?: string;
}

declare class ButtonToolbar extends LocalSvelteComponent<IButtonToolbarProps> {}
export default ButtonToolbar;
