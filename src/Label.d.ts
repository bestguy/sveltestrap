import { ColumnProps } from './Col';
import { LocalSvelteComponent } from './shared';

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
}

declare class Label extends LocalSvelteComponent<ILabelProps> {}
export default Label;
