declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface DropdownMenuProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  end?: boolean;
  right?: boolean;
class?: string;
}

export class DropdownMenu extends SvelteComponent<
  DropdownMenuProps,
  any,
  any
> {}

}
