import { SvelteComponentTyped } from 'svelte';
import { BackgroundColor } from './shared';

export interface ProgressProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  animated?: boolean;
  bar?: boolean;
  barClassName?: string;
  color?: BackgroundColor;
  max?: string | number;
  multi?: boolean;
  striped?: boolean;
  value?: string | number;
}

export default class Progress extends SvelteComponentTyped<
  ProgressProps,
  {},
  { default: {} }
> {}
