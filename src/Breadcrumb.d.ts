import { SvelteComponentTyped } from 'svelte';

export interface BreadcrumbProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['nav']> {
  divider?: string;
  listClassName?: string;
}

export default class Breadcrumb extends SvelteComponentTyped<
  BreadcrumbProps,
  {},
  { default: {} }
> {}
