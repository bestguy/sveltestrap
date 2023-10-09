declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface PaginationItemProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['li']> {
  active?: boolean;
  disabled?: boolean;
class?: string;
}

export class PaginationItem extends SvelteComponent<
  PaginationItemProps,
  any,
  any
> {}

}
