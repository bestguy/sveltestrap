declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface ToastBodyProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {class?: string;
}

export class ToastBody extends SvelteComponent<
  ToastBodyProps,
  any,
  any
> {}

}
