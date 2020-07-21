import { LocalSvelteComponent } from './shared';

export interface IButtonGroupProps {
  id?: string;
  size?: string;
  vertical?: boolean;
}

declare class ButtonGroup extends LocalSvelteComponent<IButtonGroupProps> {}
export default ButtonGroup;
