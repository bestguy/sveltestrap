declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';
  import type { Color } from './shared.d.ts';

  export interface ProgressProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    animated?: boolean;
    bar?: boolean;
    barClassName?: string;
    color?: Color;
    max?: string | number;
    multi?: boolean;
    striped?: boolean;
    value?: string | number;
    class?: string;
  }

  export class Progress extends SvelteComponent<ProgressProps, any, any> {}
}
