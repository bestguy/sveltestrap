import { SvelteComponentTyped } from 'svelte';

export interface INavbarBrandProps {
  href?: string;
}

declare class NavbarBrand extends SvelteComponentTyped<INavbarBrandProps> {}
export default NavbarBrand;
