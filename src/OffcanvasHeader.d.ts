import { SvelteComponentTyped } from 'svelte';

export interface OffcanvasHeaderProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  closeAriaLabel?: string;
  toggle?: () => void;
}

export default class OffcanvasHeader extends SvelteComponentTyped<
  OffcanvasHeaderProps,
  {},
  { default: {} }
> {}
