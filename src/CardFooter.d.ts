declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface CardFooterProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {class?: string;
}

export class CardFooter extends SvelteComponent<
  CardFooterProps,
  any,
  any
> {}

}
