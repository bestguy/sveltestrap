import { SvelteComponentTyped } from 'svelte';

export interface ButtonToolbarProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {}

export default class ButtonToolbar extends SvelteComponentTyped<
  ButtonToolbarProps,
  {},
  { default: {} }
> {}
