declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface ModalBackdropProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    fade?: boolean;
    isOpen?: boolean;
    class?: string;
  }

  export class ModalBackdrop extends SvelteComponent<
    ModalBackdropProps,
    { click: WindowEventMap['click'] },
    {}
  > {}
}
