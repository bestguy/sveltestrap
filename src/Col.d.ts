import { SvelteComponentTyped } from 'svelte';

export type ColumnProps =
  | string
  | boolean
  | number
  | {
      size?: boolean | number | string;
      push?: string | number;
      pull?: string | number;
      offset?: string | number;
      order?: string | number;
    };

export interface IColProps {
  id?: string;
  xs?: ColumnProps;
  sm?: ColumnProps;
  md?: ColumnProps;
  lg?: ColumnProps;
  xl?: ColumnProps;

  // custom widths
  widths?: string[];
}

declare class Col extends SvelteComponentTyped<IColProps> {}
export default Col;
