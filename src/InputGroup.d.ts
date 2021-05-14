import { SvelteComponentTyped } from 'svelte';

export interface InputGroupProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  size?: 'sm' | 'lg';
}

export default class InputGroup extends SvelteComponentTyped<
  InputGroupProps,
  {},
  { default: {} }
> {}
