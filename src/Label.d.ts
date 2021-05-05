import { ColumnProps } from './Col';
import { SvelteComponentTyped } from 'svelte';

export interface ILabelProps {
  hidden?: boolean;
  check?: boolean;

  size?: string;
  for?: string;

  xs?: ColumnProps;
  sm?: ColumnProps;
  md?: ColumnProps;
  lg?: ColumnProps;
  xl?: ColumnProps;
  xxl?: ColumnProps;
}

declare class Label extends SvelteComponentTyped<ILabelProps> {}
export default Label;
