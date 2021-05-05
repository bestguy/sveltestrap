import { SvelteComponentTyped } from 'svelte';

export interface IBreadcrumbItemProps {
  active?: boolean;
}

declare class BreadcrumbItem extends SvelteComponentTyped<
  IBreadcrumbItemProps
> {}
export default BreadcrumbItem;
