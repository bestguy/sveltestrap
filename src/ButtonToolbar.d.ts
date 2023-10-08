declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface ButtonToolbarProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {class?: string;
}

export class ButtonToolbar extends SvelteComponent<
  ButtonToolbarProps,
  any,
  any
> {}

}
