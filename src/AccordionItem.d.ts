import { SvelteComponentTyped } from 'svelte';

export interface AccordionItemProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  active?: boolean;
  header?: string;
}

export default class AccordionItem extends SvelteComponentTyped<
  AccordionItemProps,
  {
    toggle: CustomEvent<boolean>;
  },
  {
    default: {};
    header: {};
  }
> {}
