import { LocalSvelteComponent } from './shared';

export interface IAccordionHeaderProps {
  class?: string;
}

declare class AccordionHeader extends LocalSvelteComponent<IAccordionHeaderProps> {}
export default AccordionHeader;
