declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface InlineContainerProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    class?: string;
  }

  export class InlineContainer extends SvelteComponent<
    InlineContainerProps,
    any,
    any
  > {}
}
