import { SvelteComponentTyped } from 'svelte';

export interface AccordionProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {}

export default class Accordion extends SvelteComponentTyped<
  AccordionProps,
  {},
  { default: {} }
> {}
