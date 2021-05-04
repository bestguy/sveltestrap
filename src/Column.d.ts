import { LocalSvelteComponent } from './shared';

export interface IColumnProps {
  footer?: string;
  header?: string;
  width?: string;
}

declare class Column extends LocalSvelteComponent<IColumnProps> {}
export default Column;
