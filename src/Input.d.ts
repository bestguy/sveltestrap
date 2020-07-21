import { LocalSvelteComponent, Color } from './shared';

export type InputType =
  | 'text'
  | 'email'
  | 'select'
  | 'file'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'button'
  | 'reset'
  | 'submit'
  | 'date'
  | 'datetime-local'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'range'
  | 'search'
  | 'tel'
  | 'url'
  | 'week'
  | 'password'
  | 'datetime'
  | 'time'
  | 'color';

export interface IInputProps {
  type?: InputType;
  size: string;
  bsSize?: 'lg' | 'sm';
  color?: Color;
  checked?: boolean;
  valid?: boolean;
  invalid?: boolean;
  plaintext?: boolean;
  addon?: boolean;
  value?: string;
  files?: string;
  readonly: boolean;
  multiple?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
}

declare class Input extends LocalSvelteComponent<IInputProps> {}
export default Input;
