import { SvelteComponentTyped } from 'svelte';

export interface IModalHeaderProps {
  ariaToggle?: string;
  toggle?: () => void;
  charCode?: number;
}

declare class ModalHeader extends SvelteComponentTyped<IModalHeaderProps> {}
export default ModalHeader;
