import { Breakpoints } from './shared';
import { SvelteComponentTyped } from 'svelte';

export interface TableProps<T>
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['table']> {
  bordered?: boolean;
  borderless?: boolean;
  dark?: boolean;
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
}

export default class Table<T> extends SvelteComponentTyped<
  TableProps<T>,
  {},
  TableSlots<T>
> {}
