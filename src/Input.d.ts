declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';
import type { Color } from './shared.d.ts';

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
  reverse?: boolean;
  type?: InputType;
  valid?: boolean;
  files?: FileList;
  group?: any;
class?: string;
}

export class Input extends SvelteComponent<
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
  any
> {}

}
