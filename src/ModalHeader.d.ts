declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface ModalHeaderProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    ariaToggle?: string;
    toggle?: () => void;
    class?: string;
  }

  export class ModalHeader extends SvelteComponent<
    ModalHeaderProps,
    any,
    { default: {}; close: {} }
  > {}
}
