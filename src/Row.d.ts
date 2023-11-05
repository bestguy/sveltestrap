declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export type ColumnProps =
    | string
    | number
    | {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
      };

  export interface RowProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    cols?: ColumnProps;
    noGutters?: boolean;
    form?: boolean;
    inner?: HTMLElement;
    class?: string;
  }

  export class Row extends SvelteComponent<RowProps, any, any> {}
}
