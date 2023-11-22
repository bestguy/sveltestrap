declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface ToastHeaderProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    toggle?: () => void;
    icon?: any;
    closeAriaLabel?: string;
    class?: string;
  }

  export class ToastHeader extends SvelteComponent<
    ToastHeaderProps,
    any,
    { default: {}; close: {}; icon: {} }
  > {}
}
