declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface ColumnProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['td']> {
    footer?: string;
    header?: string;
    width?: string;
    class?: string;
  }

  export class Column extends SvelteComponent<
    ColumnProps,
    any,
    { default: {}; footer: {}; header: {} }
  > {}
}
