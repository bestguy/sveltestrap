import { LocalSvelteComponent } from './shared';

export interface INavItemProps {
  active?: boolean;
}

declare class NavItem extends LocalSvelteComponent<INavItemProps> {}
export default NavItem;
