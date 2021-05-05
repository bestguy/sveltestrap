import { SvelteComponentTyped } from 'svelte';
import { IFadeProps } from './Fade';
import { ContainerType } from './shared';

export interface IModalProps {
  autoFocus?: boolean;
  backdrop?: boolean | 'static';
  backdropClassName?: string;
  backdropDuration?: number;
  body?: boolean;
  centered?: boolean;
  container?: ContainerType;
  contentClassName?: string;
  fade?: boolean;
  header?: string;
  isOpen?: boolean;
  keyboard?: boolean;
  labelledBy?: string;
  modalClassName?: string;
  onClosed?: () => void;
  onEnter?: () => void;
  onExit?: () => void;
  onOpened?: () => void;
  returnFocusAfterClose?: boolean;
  scrollable?: boolean;
  size?: string;
  toggle?: () => void;
  transitionOptions?: IFadeProps | {};
  unmountOnClose?: boolean;
  wrapClassName?: string;
  zIndex?: number | string;
}

declare class Modal extends SvelteComponentTyped<IModalProps> {}
export default Modal;
