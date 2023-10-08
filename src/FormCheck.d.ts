declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

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
class?: string;
}

export class FormCheck extends SvelteComponent<
  FormCheckProps,
  {
    blur: WindowEventMap['blur'];
    change: WindowEventMap['change'];
    focus: WindowEventMap['focus'];
    input: WindowEventMap['input'];
  },
  any
> {}

}
