import { SvelteComponentTyped } from 'svelte';
import { BackgroundColor } from './shared';

export interface INavbarProps {
  light?: boolean;
  dark?: boolean;
  fixed?: string;
  sticky?: string;
  color?: BackgroundColor;
  expand?: boolean | string;
}

declare class Navbar extends SvelteComponentTyped<INavbarProps> {}
export default Navbar;
