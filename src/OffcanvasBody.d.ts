import { SvelteComponentTyped } from 'svelte';

export interface OffcanvasBodyProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {}

export default class OffcanvasBody extends SvelteComponentTyped<
  OffcanvasBodyProps,
  {},
  { default: {} }
> {}
