import { Color } from './shared';
import { LocalSvelteComponent } from './shared';

export interface IBadgeProps {
  color?: Color;
  href?: string;
  pill?: boolean;
}

declare class Badge extends LocalSvelteComponent<IBadgeProps> {}
export default Badge;
