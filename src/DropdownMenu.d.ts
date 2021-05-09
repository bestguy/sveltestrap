import { SvelteComponentTyped } from 'svelte';

export interface DropdownMenuProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  dark?: boolean;
  end?: boolean;
  right?: boolean;
}

export default class DropdownMenu extends SvelteComponentTyped<
  DropdownMenuProps,
  {},
  { default: {} }
> {}
