import { LocalSvelteComponent } from './shared';

export interface IBreadcrumbItemProps {
  active?: boolean;
}

declare class BreadcrumbItem extends LocalSvelteComponent<
  IBreadcrumbItemProps
> {}
export default BreadcrumbItem;
