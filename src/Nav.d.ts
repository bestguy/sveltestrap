import { SvelteComponentTyped } from 'svelte';

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

declare class Nav extends SvelteComponentTyped<INavProps> {}
export default Nav;
