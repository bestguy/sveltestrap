import { SvelteComponentTyped } from 'svelte';

export interface JumbotronProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> { }

export default class Jumbotron extends SvelteComponentTyped<
  JumbotronProps,
  {},
  { default: {} }
> {}
