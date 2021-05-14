import { SvelteComponentTyped } from 'svelte';

export interface ModalBodyProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {}

export default class ModalBody extends SvelteComponentTyped<
  ModalBodyProps,
  {},
  { default: {} }
> {}
