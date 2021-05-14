import { SvelteComponentTyped } from 'svelte';

export interface InputGroupTextProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['span']> {}

export default class InputGroupText extends SvelteComponentTyped<
  InputGroupTextProps,
  {},
  { default: {} }
> {}
