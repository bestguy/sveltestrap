import { LocalSvelteComponent } from './shared';

export interface IInputGroupProps {
  size?: 'sm' | 'lg';
}

declare class InputGroup extends LocalSvelteComponent<IInputGroupProps> {}
export default InputGroup;
