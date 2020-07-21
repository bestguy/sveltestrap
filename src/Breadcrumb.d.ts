import { LocalSvelteComponent } from './shared';

export interface IBreadcrumbProps {
  ariaLabel?: string;
  listClassName?: string;
}

declare class Breadcrumb extends LocalSvelteComponent<IBreadcrumbProps> {}
export default Breadcrumb;
