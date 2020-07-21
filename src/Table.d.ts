import { LocalSvelteComponent } from './shared';

export interface TableProps {
  size?: string;
  bordered?: boolean;
  borderless?: boolean;
  striped?: boolean;
  dark?: boolean;
  hover?: boolean;
  responsive?: boolean | string;
}

declare class Table extends LocalSvelteComponent<TableProps> {}
export default Table;
