import { SvelteComponentTyped } from 'svelte';

export interface AccordionProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  flush?: boolean;
  stayOpen?: boolean;
}

export default class Accordion extends SvelteComponentTyped<
  AccordionProps,
  {},
  { default: {} }
> {}
