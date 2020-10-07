import { LocalSvelteComponent } from './shared';

export interface INavbarBrandProps {
  href?: string;
}

declare class NavbarBrand extends LocalSvelteComponent<INavbarBrandProps> {}
export default NavbarBrand;
