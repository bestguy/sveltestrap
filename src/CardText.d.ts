declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface CardTextProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['p']> {class?: string;
}

export class CardText extends SvelteComponent<
  CardTextProps,
  any,
  any
> {}

}
