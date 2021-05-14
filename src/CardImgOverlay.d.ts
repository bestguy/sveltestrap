import { SvelteComponentTyped } from 'svelte';

export interface CardImgOverlayProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {}

export default class CardImgOverlay extends SvelteComponentTyped<
  CardImgOverlayProps,
  {},
  { default: {} }
> {}
