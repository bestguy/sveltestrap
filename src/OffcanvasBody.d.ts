declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface OffcanvasBodyProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    class?: string;
  }

  export class OffcanvasBody extends SvelteComponent<
    OffcanvasBodyProps,
    any,
    any
  > {}
}
