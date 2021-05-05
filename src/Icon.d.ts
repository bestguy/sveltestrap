import { SvelteComponentTyped } from 'svelte';

export interface IIconProps {
  name: string;
}

declare class Icon extends SvelteComponentTyped<IIconProps> {}
export default Icon;
