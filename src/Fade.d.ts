import { SvelteComponentTyped } from 'svelte';

export interface FadeProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  isOpen?: boolean;
  onEntering?: () => void;
  onEntered?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
  toggler?: string;
}

export default class Fade extends SvelteComponentTyped<
FadeProps,
  {},
  { default: {} }
> {}
