import { SvelteComponentTyped } from 'svelte';

export interface ToastHeaderProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  toggle?: () => void;
  icon?: any;
  closeAriaLabel?: string;
}

export default class ToastHeader extends SvelteComponentTyped<
  ToastHeaderProps,
  {},
  { default: {}; close: {}; icon: {} }
> {}
