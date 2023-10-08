declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface FadeProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  isOpen?: boolean;
  onEntering?: () => void;
  onEntered?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
  toggler?: string;
class?: string;
}

export class Fade extends SvelteComponent<
  FadeProps,
  {
    open: CustomEvent<void>;
    opening: CustomEvent<void>;
    closing: CustomEvent<void>;
    close: CustomEvent<void>;
  },
  any
> {}

}
