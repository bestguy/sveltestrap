import { SvelteComponentTyped } from 'svelte';

export interface ModalFooterProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {}

export default class ModalFooter extends SvelteComponentTyped<
  ModalFooterProps,
  {},
  { default: {} }
> {}
