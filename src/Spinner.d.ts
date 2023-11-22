declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';
  import type { TextColor } from './shared.d.ts';

  export interface SpinnerProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    color?: TextColor;
    size?: any;
    type?: string;
    class?: string;
  }

  export class Spinner extends SvelteComponent<SpinnerProps, any, any> {}
}
