declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface AccordionHeaderProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['h2']> {
    class?: string;
  }

  export class AccordionHeader extends SvelteComponent<
    AccordionHeaderProps,
    any,
    any
  > {}
}
