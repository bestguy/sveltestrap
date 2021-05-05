import { SvelteComponentTyped } from 'svelte';

export interface IAccordionItemProps {
  class?: string;
  header?: string;
  active?: boolean;
}

declare class AccordionItem extends SvelteComponentTyped<IAccordionItemProps> {}
export default AccordionItem;
