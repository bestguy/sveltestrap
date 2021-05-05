import { Color } from './shared';
import { SvelteComponentTyped } from 'svelte';

export interface IBadgeProps {
  color?: Color;
  href?: string;
  pill?: boolean;
}

declare class Badge extends SvelteComponentTyped<IBadgeProps> {}
export default Badge;
