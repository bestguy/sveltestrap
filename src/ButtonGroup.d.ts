declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface ButtonGroupProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    size?: string;
    vertical?: boolean;
    class?: string;
  }

  export class ButtonGroup extends SvelteComponent<
    ButtonGroupProps,
    any,
    any
  > {}
}
