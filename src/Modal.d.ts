import { SvelteComponentTyped } from 'svelte';
import { FadeProps } from './Fade';
import { ContainerType } from './shared';

export interface ModalProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
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
  returnFocusAfterClose?: boolean;
  scrollable?: boolean;
  size?: string;
  toggle?: () => void;
  transitionOptions?: FadeProps | {};
  unmountOnClose?: boolean;
  wrapClassName?: string;
  zIndex?: number | string;
}

export default class Modal extends SvelteComponentTyped<
  ModalProps,
  {
    open: CustomEvent<void>;
    opening: CustomEvent<void>;
    closing: CustomEvent<void>;
    close: CustomEvent<void>;
  },
  {
    default: {};
    external: {};
  }
> {}
