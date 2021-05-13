import { SvelteComponentTyped } from 'svelte';

export interface CardSubtitleProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['h6']> {}

export default class CardSubtitle extends SvelteComponentTyped<
  CardSubtitleProps,
  {},
  { default: {} }
> {}
