import { SvelteComponentTyped } from 'svelte';

export interface OffcanvasHeaderProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  closeAriaLabel?: string;
  closeButton?: boolean;
  toggle?: () => void;
}

export default class OffcanvasHeader extends SvelteComponentTyped<
  OffcanvasHeaderProps,
  {},
  { default: {} }
> {}
