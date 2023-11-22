declare module 'sveltestrap' {
  import type { ColumnProps } from './Col.d.ts';
  import { SvelteComponent } from 'svelte';

  export interface LabelProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['label']> {
    check?: boolean;
    for?: string;
    hidden?: boolean;
    lg?: ColumnProps;
    md?: ColumnProps;
    size?: string;
    sm?: ColumnProps;
    xl?: ColumnProps;
    xs?: ColumnProps;
    xxl?: ColumnProps;
    class?: string;
  }

  export class Label extends SvelteComponent<LabelProps, any, any> {}
}
