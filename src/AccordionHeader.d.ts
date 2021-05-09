import { SvelteComponentTyped } from 'svelte';

export interface AccordionHeaderProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['h2']> {}

export default class AccordionHeader extends SvelteComponentTyped<
  AccordionHeaderProps,
  {},
  { default: {} }
> {}
