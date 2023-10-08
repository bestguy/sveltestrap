declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface InputGroupTextProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['span']> {class?: string;
}

export class InputGroupText extends SvelteComponent<
  InputGroupTextProps,
  any,
  any
> {}

}
