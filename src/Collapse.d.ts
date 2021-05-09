import { SvelteComponentTyped } from 'svelte';

export interface CollapseProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  expand?: boolean | string;
  isOpen?: boolean;
  navbar?: boolean;
  onClosed?: () => void;
  onEntered?: () => void;
  onEntering?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  onExiting?: () => void;
  onOpened?: () => void;
  toggler?: string;
}

export default class ollapse extends SvelteComponentTyped<
  CollapseProps,
  {
    update: CustomEvent<any>;
  },
  { default: {} }
> {}
