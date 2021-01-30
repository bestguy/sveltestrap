import { LocalSvelteComponent } from './shared';

export interface IRowProps {
  id?: string;
  noGutters?: boolean;
  form?: boolean;
}

declare class Row extends LocalSvelteComponent<IRowProps> {}
export default Row;
