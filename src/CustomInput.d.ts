import { SvelteComponent } from 'svelte';
import { SvelteComponentTyped } from 'svelte';

export type CustomInputType =
  | 'select'
  | 'file'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'range';

export interface ICustomInputProps {
  id?: string;
  type: CustomInputType;
  name?: string;
  label?: any;
  checked?: boolean;
  disabled?: boolean;
  inline?: boolean;
  bsSize?: 'lg' | 'sm';
  valid?: boolean;
  value?: string;
  invalid?: boolean;
  placeholder?: string;
  for?: string;
}

declare class CustomInput extends SvelteComponentTyped<ICustomInputProps> {}
export default CustomInput;
