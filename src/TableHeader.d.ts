declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface TableHeaderProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['thead']> {class?: string;
}

export class TableHeader extends SvelteComponent<
  TableHeaderProps,
  any,
  any
> {}

}
