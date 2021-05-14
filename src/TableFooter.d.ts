import { SvelteComponentTyped } from 'svelte';

export interface TableFooterProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['tfoot']> {}

export default class TableFooter extends SvelteComponentTyped<
  TableFooterProps,
  {},
  { default: {} }
> {}
