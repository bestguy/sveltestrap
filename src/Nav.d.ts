import { LocalSvelteComponent } from './shared';

export interface INavProps {
  tabs?: boolean;
  pills?: boolean;
  vertical?: boolean | string;
  horizontal?: string;
  justified?: boolean;
  fill?: boolean;
  navbar?: boolean;
  card?: boolean;
}

declare class Nav extends LocalSvelteComponent<INavProps> {}
export default Nav;
