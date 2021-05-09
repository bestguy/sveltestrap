import { SvelteComponentTyped } from 'svelte';

export interface ColumnProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['td']> {
  footer?: string;
  header?: string;
  width?: string;
}

export default class Column extends SvelteComponentTyped<
  ColumnProps,
  {},
  { default: {}; footer: {}; header: {} }
> {}
