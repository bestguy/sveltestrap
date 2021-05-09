import { SvelteComponentTyped } from 'svelte';
import { ContainerType } from './shared';

declare type Placement = 'start' | 'end' | 'bottom'; // TODO support left & right alias

export interface OffcanvasProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  backdrop?: boolean;
  container?: ContainerType;
  header?: string;
  isOpen: boolean;
  placement?: Placement;
  scroll?: boolean;
  toggle?: () => void;
}

export default class Offcanvas extends SvelteComponentTyped<
  OffcanvasProps,
  {},
  {
    default: {}
    header: {}
  }
> {}
