import { SvelteComponentTyped } from 'svelte';
import { ContainerType } from './shared';

declare type Placement = 'start' | 'end' | 'top' | 'bottom'; // TODO support left & right alias

export interface OffcanvasProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  backdrop?: boolean;
  body?: boolean;
  container?: ContainerType;
  fade?: boolean;
  header?: string;
  isOpen: boolean;
  placement?: Placement;
  scroll?: boolean;
  toggle?: () => void;
}

export default class Offcanvas extends SvelteComponentTyped<
  OffcanvasProps,
  {
    open: CustomEvent<void>;
    opening: CustomEvent<void>;
    closing: CustomEvent<void>;
    close: CustomEvent<void>;
  },
  {
    default: {};
    header: {};
  }
> {}
