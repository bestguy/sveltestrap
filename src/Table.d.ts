import { Breakpoints } from './shared';
import { SvelteComponentTyped } from 'svelte';

export interface TableProps<T> {
  size?: string;
  bordered?: boolean;
  borderless?: boolean;
  striped?: boolean;
  dark?: boolean;
  hover?: boolean;
  responsive?: boolean | Breakpoints;
  rows?: T[];
}

export interface TableSlots<T> {
  default: {
    row?: T
  }
}

declare class Table<T> extends SvelteComponentTyped<TableProps<T>, {}, TableSlots<T>> {}
export default Table;
