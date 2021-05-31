import { SvelteComponentTyped } from 'svelte';

export interface ToastProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  autohide?: boolean;
  body?: boolean;
  delay?: number;
  duration?: number;
  fade?: boolean;
  header?: string;
  isOpen?: boolean;
  toggle?: () => void;
}

export default class Toast extends SvelteComponentTyped<
  ToastProps,
  {
    open: CustomEvent<void>;
    opening: CustomEvent<void>;
    closing: CustomEvent<void>;
    close: CustomEvent<void>;
  },
  { default: {} }
> {}
