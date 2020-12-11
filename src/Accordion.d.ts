import { LocalSvelteComponent } from './shared';

export interface IAccordionProps {
  class?: string;
}

declare class Accordion extends LocalSvelteComponent<IAccordionProps> {}
export default Accordion;
