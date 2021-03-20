import { BackgroundColor, LocalSvelteComponent } from './shared';

export interface INavbarProps {
  light?: boolean;
  dark?: boolean;
  fixed?: string;
  sticky?: string;
  color?: BackgroundColor;
  expand?: boolean | string;
}

declare class Navbar extends LocalSvelteComponent<INavbarProps> {}
export default Navbar;
