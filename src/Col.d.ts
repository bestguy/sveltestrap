/// <reference types="svelte" />
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

export interface ColProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  id?: string;
  xs?: ColumnProps;
  sm?: ColumnProps;
  md?: ColumnProps;
  lg?: ColumnProps;
  xl?: ColumnProps;
  xxl?: ColumnProps;

  // custom widths
  widths?: string[];
}

export default class Col extends SvelteComponentTyped<
  ColProps,
  {},
  { default: {} }
> {}
