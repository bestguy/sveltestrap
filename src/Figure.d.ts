import { SvelteComponentTyped } from 'svelte';

export interface FigureProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['figure']> {}

export default class Figure extends SvelteComponentTyped<
  FigureProps,
  {},
  { default: {}, caption: {} }
> {}
