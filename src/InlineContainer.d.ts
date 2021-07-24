import { SvelteComponentTyped } from 'svelte';

export interface InlineContainerProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {}

export default class InlineContainer extends SvelteComponentTyped<
  InlineContainerProps,
  {},
  { default: {} }
> {}
