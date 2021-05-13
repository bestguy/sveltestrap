import { SvelteComponentTyped } from 'svelte';
import { Color } from './shared';

export interface SpinnerProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  color?: Color;
  size?: any;
  type?: string;
}

export default class Spinner extends SvelteComponentTyped<
  SpinnerProps,
  {},
  { default: {} }
> {}
