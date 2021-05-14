import { SvelteComponentTyped } from 'svelte';

export interface TableHeaderProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['thead']> {}

export default class TableHeader extends SvelteComponentTyped<
  TableHeaderProps,
  {},
  { default: {} }
> {}
