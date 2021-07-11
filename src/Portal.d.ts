import { SvelteComponentTyped } from 'svelte';

export interface PortalProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {}

export default class Portal extends SvelteComponentTyped<
  PortalProps,
  {},
  { default: {} }
> {}
