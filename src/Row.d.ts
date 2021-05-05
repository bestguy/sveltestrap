import { SvelteComponentTyped } from 'svelte';

export type ColumnProps =
  | string
  | number
  | {
      xs? : number;
      sm? : number;
      md? : number;
      lg? : number;
      xl? : number;
    };

export interface IRowProps {
  cols?: ColumnProps;
  noGutters?: boolean;
  form?: boolean;
}

declare class Row extends SvelteComponentTyped<IRowProps> {}
export default Row;
