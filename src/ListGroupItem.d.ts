declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';
  import type { Color } from './shared.d.ts';

  export interface ListGroupItemProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['a']> {
    action?: boolean;
    active?: boolean;
    color?: Color;
    disabled?: boolean;
    href?: string;
    tag?: 'a' | 'button' | 'li';
    class?: string;
  }

  export class ListGroupItem extends SvelteComponent<
    ListGroupItemProps,
    { click: WindowEventMap['click'] },
    any
  > {}
}
