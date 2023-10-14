declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface FigureProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['figure']> {class?: string;
}

export class Figure extends SvelteComponent<
  FigureProps,
  any,
  { default: {}; caption: {} }
> {}

}
