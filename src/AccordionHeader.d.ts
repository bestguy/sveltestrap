import { SvelteComponentTyped } from 'svelte';

export interface IAccordionHeaderProps {
  class?: string;
}

declare class AccordionHeader extends SvelteComponentTyped<IAccordionHeaderProps> {}
export default AccordionHeader;
