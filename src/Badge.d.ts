declare module 'sveltestrap' {
  import type { Color } from './shared.d.ts';
  import { SvelteComponent } from 'svelte';

  export interface BadgeProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['a']> {
    color?: Color;
    href?: string;
    pill?: boolean;
    class?: string;
  }

  export class Badge extends SvelteComponent<BadgeProps, any, any> {}
}
