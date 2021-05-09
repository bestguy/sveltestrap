import { SvelteComponentTyped } from 'svelte';

export interface FormProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['form']> {
  inline?: boolean;
}

export default class Form extends SvelteComponentTyped<
  FormProps,
  { submit: WindowEventMap['submit'] },
  { default: {} }
> {}
