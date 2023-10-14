declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface PaginationProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['nav']> {
  listClassName?: string;
  size?: string;
  arialabel?: string;
class?: string;
}

export class Pagination extends SvelteComponent<
  PaginationProps,
  any,
  any
> {}

}
