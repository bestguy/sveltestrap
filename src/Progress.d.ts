import { LocalSvelteComponent, BackgroundColor } from './shared';

export interface IProgressProps {
  bar?: boolean;
  multi?: boolean;
  value?: string | number;
  max?: string | number;
  animated?: boolean;
  striped?: boolean;
  color?: BackgroundColor;
  barClassName?: string;
}

declare class Progress extends LocalSvelteComponent<IProgressProps> {}
export default Progress;
