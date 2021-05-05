import { SvelteComponentTyped } from 'svelte';

export interface ContainerProps {
  id?: string;

  fluid?: boolean | string;
}

declare class Container extends SvelteComponentTyped<ContainerProps> {}
export default Container;
