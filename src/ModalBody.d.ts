declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface ModalBodyProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {class?: string;
}

export class ModalBody extends SvelteComponent<
  ModalBodyProps,
  any,
  any
> {}

}
