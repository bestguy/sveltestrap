declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface ModalFooterProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    class?: string;
  }

  export class ModalFooter extends SvelteComponent<
    ModalFooterProps,
    any,
    any
  > {}
}
