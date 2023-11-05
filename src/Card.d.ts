declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';
  import type { Color } from './shared.d.ts';

  export interface CardProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    id?: string;
    inverse?: boolean;
    color?: Color;
    body?: boolean;
    outline?: boolean;
    class?: string;
  }

  export class Card extends SvelteComponent<
    CardProps,
    { click: WindowEventMap['click'] },
    any
  > {}
}
