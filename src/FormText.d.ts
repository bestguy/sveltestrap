import { SvelteComponentTyped } from 'svelte';
import { TextColor } from './shared';

export interface FormTextProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['small']> {
  color?: TextColor;
  inline?: boolean;
}

export default class FormText extends SvelteComponentTyped<
  FormTextProps,
  {},
  { default: {} }
> {}
