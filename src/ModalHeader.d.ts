import { LocalSvelteComponent } from './shared';

export interface IModalHeaderProps {
  ariaToggle?: string;
  toggle?: () => void;
}

declare class ModalHeader extends LocalSvelteComponent<IModalHeaderProps> {}
export default ModalHeader;
