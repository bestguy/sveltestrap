declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface BreadcrumbProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['nav']> {
  divider?: string;
  listClassName?: string;
class?: string;
}

export class Breadcrumb extends SvelteComponent<
  BreadcrumbProps,
  any,
  any
> {}

}
