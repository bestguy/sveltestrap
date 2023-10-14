declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface JumbotronProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {class?: string;
}

export class Jumbotron extends SvelteComponent<
  JumbotronProps,
  any,
  any
> {}

}
