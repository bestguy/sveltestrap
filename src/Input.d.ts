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
  color?: Color;
  feedback?: string | string[];
  inner?: HTMLElement;
  invalid?: boolean;
  label?: string;
  plaintext?: boolean;
  type?: InputType;
  valid?: boolean;
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

