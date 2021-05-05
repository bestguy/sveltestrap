import { SvelteComponentTyped } from 'svelte';

export interface INavLinkProps {
  disabled?: boolean;
  active?: boolean;
  href?: string;
}

declare class NavLink extends SvelteComponentTyped<INavLinkProps> {}
export default NavLink;
