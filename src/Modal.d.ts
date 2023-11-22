declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';
  import type { FadeProps } from './Fade.d.ts';
  import type { Breakpoints, ContainerType } from './shared.d.ts';

  export interface ModalProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    autoFocus?: boolean;
    backdrop?: boolean | 'static';
    body?: boolean;
    centered?: boolean;
    container?: ContainerType;
    contentClassName?: string;
    fade?: boolean;
    fullscreen?: boolean | Breakpoints;
    header?: string;
    isOpen?: boolean;
    keyboard?: boolean;
    labelledBy?: string;
    modalClassName?: string;
    returnFocusAfterClose?: boolean;
    scrollable?: boolean;
    size?: string;
    toggle?: () => void;
    unmountOnClose?: boolean;
    wrapClassName?: string;
    zIndex?: number | string;
    class?: string;
  }

  export class Modal extends SvelteComponent<
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
}
