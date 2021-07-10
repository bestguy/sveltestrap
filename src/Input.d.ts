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

export interface InputProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['input']> {
  bsSize?: 'lg' | 'sm';
  checked?: boolean;
  color?: Color;
  disabled?: boolean;
  feedback?: string | string[];
  files?: string;
  group?: any;
  id?: string;
  inner?: HTMLElement;
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

export default class Input extends SvelteComponentTyped<
  InputProps,
  {
    blur: WindowEventMap['blur'];
    focus: WindowEventMap['focus'];
    keydown: WindowEventMap['keydown'];
    keypress: WindowEventMap['keypress'];
    keyup: WindowEventMap['keyup'];
    change: WindowEventMap['change'];
    input: WindowEventMap['input'];
  },
  { default: {} }
> {}
