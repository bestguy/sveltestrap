import { SvelteComponentTyped } from 'svelte';
import { Color } from './shared';

export type InputType = 'checkbox' | 'radio' | 'switch';

export interface FormCheckProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['input']> {
  checked?: boolean;
  disabled?: boolean;
  group?: any;
  id?: string;
  inline?: boolean;
  invalid?: boolean;
  label?: string;
  name?: string;
  readonly?: boolean;
  reverse?: boolean;
  size?: 'lg' | 'sm';
  type?: InputType;
  valid?: boolean;
  value?: string;
  inner?: HTMLElement;
}

export default class FormCheck extends SvelteComponentTyped<
  FormCheckProps,
  {
    blur: WindowEventMap['blur'];
    change: WindowEventMap['change'];
    focus: WindowEventMap['focus'];
    input: WindowEventMap['input'];
  },
  { default: {} }
> {}
