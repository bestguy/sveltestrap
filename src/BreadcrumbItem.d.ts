declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface BreadcrumbItemProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['li']> {
  active?: boolean;
class?: string;
}

export class BreadcrumbItem extends SvelteComponent<
  BreadcrumbItemProps,
  any,
  any
> {}

}
