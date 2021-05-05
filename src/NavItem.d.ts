import { SvelteComponentTyped } from 'svelte';

export interface INavItemProps {
  active?: boolean;
}

declare class NavItem extends SvelteComponentTyped<INavItemProps> {}
export default NavItem;
