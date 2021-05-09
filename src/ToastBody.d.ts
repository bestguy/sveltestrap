import { SvelteComponentTyped } from 'svelte';

export interface ToastBodyProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {}

export default class ToastBody extends SvelteComponentTyped<
  ToastBodyProps,
  {},
  { default: {} }
> {}
