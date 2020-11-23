import * as React from 'react';
import { IFadeProps } from './Fade';
import { LocalSvelteComponent } from './shared';

export interface IModalProps {
  isOpen?: boolean;
  autoFocus?: boolean;
  backdropDuration?: number;
  size?: string;
  toggle?: () => void;
  keyboard?: boolean;
  backdrop?: boolean | 'static';
  scrollable?: boolean;
  onEnter?: () => void;
  onExit?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
  wrapClassName?: string;
  modalClassName?: string;
  backdropClassName?: string;
  contentClassName?: string;
  zIndex?: number | string;
  fade?: boolean;
  centered?: boolean;
  external?: React.ReactNode;
  labelledBy?: string;
  unmountOnClose?: boolean;
  returnFocusAfterClose?: boolean;
  transitionOptions: IFadeProps | {};
}

declare class Modal extends LocalSvelteComponent<IModalProps> {}
export default Modal;
