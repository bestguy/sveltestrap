import { LocalSvelteComponent } from './shared';

export interface ContainerProps {
  id?: string;

  fluid?: boolean | string;
}

declare class Container extends LocalSvelteComponent<ContainerProps> {}
export default Container;
