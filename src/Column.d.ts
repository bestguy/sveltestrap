import { SvelteComponentTyped } from 'svelte';

export interface IColumnProps {
  footer?: string;
  header?: string;
  width?: string;
}

declare class Column extends SvelteComponentTyped<IColumnProps> {}
export default Column;
