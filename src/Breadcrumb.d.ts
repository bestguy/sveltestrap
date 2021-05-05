import { SvelteComponentTyped } from 'svelte';

export interface IBreadcrumbProps {
  ariaLabel?: string;
  listClassName?: string;
}

declare class Breadcrumb extends SvelteComponentTyped<IBreadcrumbProps> {}
export default Breadcrumb;
