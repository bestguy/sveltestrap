declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface AccordionProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    flush?: boolean;
    stayOpen?: boolean;
    class?: string;
  }

  export class Accordion extends SvelteComponent<
    AccordionProps,
    {
      toggle: CustomEvent<any>;
    },
    any
  > {}
}
