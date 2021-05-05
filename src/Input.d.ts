import { SvelteComponentTyped } from 'svelte';
import { Color } from './shared';

export type InputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'select'
  | 'submit'
  | 'switch'
  | 'tel'
  | 'text'
  | 'textarea'
  | 'time'
  | 'url'
  | 'week';

export interface IInputProps {
  addon?: boolean;
  bsSize?: 'lg' | 'sm';
  checked?: boolean;
  color?: Color;
  disabled?: boolean;
  files?: string;
  group?: any;
  id?: string;
  invalid?: boolean;
  label?: string;
  multiple?: boolean;
  name?: string;
  placeholder?: string;
  plaintext?: boolean;
  readonly?: boolean;
  size?: number | string;
  type?: InputType;
  valid?: boolean;
  value?: string;
}

declare class Input extends SvelteComponentTyped<IInputProps> {}
export default Input;
