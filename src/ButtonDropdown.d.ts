declare module 'sveltestrap' {
  import type { DropdownProps } from './Dropdown.d.ts';
  import { SvelteComponent } from 'svelte';

  export interface ButtonDropdownProps extends Omit<DropdownProps, 'group'> {
    class?: string;
  }

  export class ButtonDropdown extends SvelteComponent<
    ButtonDropdownProps,
    any,
    {
      default: {};
    }
  > {}
}
