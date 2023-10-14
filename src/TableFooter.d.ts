declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface TableFooterProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['tfoot']> {class?: string;
}

export class TableFooter extends SvelteComponent<
  TableFooterProps,
  any,
  any
> {}

}
