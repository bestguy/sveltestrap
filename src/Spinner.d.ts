import { SvelteComponentTyped } from 'svelte';
import { Color } from './shared';

export interface ISpinnerProps {
  type?: string;
  size?: any;
  color?: Color;
}

declare class Spinner extends SvelteComponentTyped<ISpinnerProps> {}
export default Spinner;
