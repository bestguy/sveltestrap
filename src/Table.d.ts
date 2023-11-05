declare module 'sveltestrap' {
  import type { Breakpoints } from './shared.d.ts';
  import { SvelteComponent } from 'svelte';

  export interface TableProps<T>
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['table']> {
    bordered?: boolean;
    borderless?: boolean;
    hover?: boolean;
    responsive?: boolean | Breakpoints;
    rows?: T[];
    size?: string;
    striped?: boolean;
  }

  export interface TableSlots<T> {
    default: {
      row?: T;
    };
    class?: string;
  }

  export class Table<T> extends SvelteComponent<
    TableProps<T>,
    any,
    TableSlots<T>
  > {}
}
