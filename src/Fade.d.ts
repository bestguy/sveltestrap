import { SvelteComponentTyped } from 'svelte';

export interface FadeProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  isOpen?: boolean;
  onEntering?: () => void;
  onEntered?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
  renderWhenClosed?: boolean;
  toggler?: string;
}

export default class Fade extends SvelteComponentTyped<
  FadeProps,
  {
    open: CustomEvent<void>;
    opening: CustomEvent<void>;
    closing: CustomEvent<void>;
    close: CustomEvent<void>;
  },
  { default: {} }
> {}
