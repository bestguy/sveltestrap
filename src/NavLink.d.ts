import { LocalSvelteComponent } from './shared';

export interface INavLinkProps {
  disabled?: boolean;
  active?: boolean;
  href?: string;
}

declare class NavLink extends LocalSvelteComponent<INavLinkProps> {}
export default NavLink;
