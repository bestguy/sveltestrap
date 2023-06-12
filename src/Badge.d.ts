import { BackgroundColor } from './shared';
import { SvelteComponentTyped } from 'svelte';

export interface BadgeProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['a']> {
  color?: BackgroundColor;
  href?: string;
  pill?: boolean;
}

export default class Badge extends SvelteComponentTyped<
  BadgeProps,
  {},
  { default: {} }
> {}
