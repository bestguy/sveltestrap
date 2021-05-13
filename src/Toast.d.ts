import { SvelteComponentTyped } from 'svelte';

export interface ToastProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  duration?: number;
  fade?: boolean;
  isOpen?: boolean;
}

export default class Toast extends SvelteComponentTyped<
  ToastProps,
  {},
  { default: {} }
> {}
