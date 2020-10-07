import { Color, LocalSvelteComponent } from './shared';

export interface ISpinnerProps {
  type?: string;
  size?: any;
  color?: Color;
}

declare class Spinner extends LocalSvelteComponent<ISpinnerProps> {}
export default Spinner;
