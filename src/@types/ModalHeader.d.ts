import { LocalSvelteComponent } from './shared';

export interface IModalHeaderProps {
  ariaToggle?: string;
  toggle?: () => void;
  charCode?: number;
}

declare class ModalHeader extends LocalSvelteComponent<IModalHeaderProps> {}
export default ModalHeader;
