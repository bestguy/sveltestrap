import { SvelteComponentTyped } from 'svelte';

export interface ICollapseProps {
  expand?: boolean | string;
  isOpen?: boolean;
  navbar?: boolean;
  toggler?: string;
  onOpened?: () => void;
  onClosed?: () => void;
  onEntering?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
}

declare class Collapse extends SvelteComponentTyped<ICollapseProps> {}
export default Collapse;
