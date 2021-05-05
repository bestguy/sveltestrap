import { SvelteComponentTyped } from 'svelte';
import { ContainerType } from './shared';

declare type Placement = 'start' | 'end' | 'bottom'; // TODO support left & right alias

export interface OffcanvasProps {
  backdrop?: boolean;
  container?: ContainerType;
  header?: string;
  isOpen: boolean;
  placement?: Placement;
  scroll?: boolean;
  toggle?: () => void;
}

declare class Offcanvas extends SvelteComponentTyped<OffcanvasProps> {}
export default Offcanvas;
