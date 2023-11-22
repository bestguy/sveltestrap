declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface OffcanvasBackdropProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    fade?: boolean;
    isOpen?: boolean;
    class?: string;
  }

  export class OffcanvasBackdrop extends SvelteComponent<
    OffcanvasBackdropProps,
    { click: WindowEventMap['click'] },
    {}
  > {}
}
