import { SvelteComponentTyped } from 'svelte';

export interface IInputGroupProps {
  size?: 'sm' | 'lg';
}

declare class InputGroup extends SvelteComponentTyped<IInputGroupProps> {}
export default InputGroup;
