import { SvelteComponentTyped } from 'svelte';

export interface CollapseProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  expand?: boolean | string;
  isOpen?: boolean;
  navbar?: boolean;
  onEntered?: () => void;
  onEntering?: () => void;
  onExited?: () => void;
  onExiting?: () => void;
  toggler?: string;
}

export default class Collapse extends SvelteComponentTyped<
  CollapseProps,
  {
    open: CustomEvent<void>;
    opening: CustomEvent<void>;
    closing: CustomEvent<void>;
    close: CustomEvent<void>;
    update: CustomEvent<boolean>;
  },
  { default: {} }
> {}
