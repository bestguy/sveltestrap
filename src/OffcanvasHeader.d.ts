declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface OffcanvasHeaderProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  closeAriaLabel?: string;
  toggle?: () => void;
class?: string;
}

export class OffcanvasHeader extends SvelteComponent<
  OffcanvasHeaderProps,
  any,
  any
> {}

}
