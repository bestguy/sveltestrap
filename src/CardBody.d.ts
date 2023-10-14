declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface CardBodyProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {class?: string;
}

export class CardBody extends SvelteComponent<
  CardBodyProps,
  any,
  any
> {}

}
