import { SvelteComponentTyped } from 'svelte';

export interface DropdownMenuProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  end?: boolean;
  right?: boolean;
}

export default class DropdownMenu extends SvelteComponentTyped<
  DropdownMenuProps,
  {},
  { default: {} }
> {}
