import { SvelteComponentTyped } from 'svelte';

export interface ModalHeaderProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  ariaToggle?: string;
  toggle?: () => void;
}

export default class ModalHeader extends SvelteComponentTyped<
  ModalHeaderProps,
  {},
  { default: {}; close: {} }
> {}
