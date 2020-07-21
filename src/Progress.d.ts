import { LocalSvelteComponent, Color } from './shared';

export interface IProgressProps {
  bar?: boolean;
  multi?: boolean;
  value?: string | number;
  max?: string | number;
  animated?: boolean;
  striped?: boolean;
  color?: Color;
  barClassName?: string;
}

declare class Progress extends LocalSvelteComponent<IProgressProps> {}
export default Progress;
