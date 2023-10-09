declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

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
class?: string;
}

export class Toast extends SvelteComponent<
  ToastProps,
  {
    open: CustomEvent<void>;
    opening: CustomEvent<void>;
    closing: CustomEvent<void>;
    close: CustomEvent<void>;
  },
  any
> {}

}
