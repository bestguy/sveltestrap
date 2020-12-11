import { LocalSvelteComponent } from './shared';

export interface IAccordionItemProps {
  class?: string;
  header?: string;
  active?: boolean;
}

declare class AccordionItem extends LocalSvelteComponent<IAccordionItemProps> {}
export default AccordionItem;
