import { SvelteComponentTyped } from 'svelte';

export interface IAccordionProps {
  class?: string;
}

declare class Accordion extends SvelteComponentTyped<IAccordionProps> {}
export default Accordion;
