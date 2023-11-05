declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';
  import type { Direction } from './shared.d.ts';

  export interface DropdownProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    direction?: Direction;
    group?: boolean;
    isOpen?: boolean;
    autoClose?: boolean | string;
    nav?: boolean;
    active?: boolean;
    size?: string;
    toggle?: () => void;
    inNavbar?: boolean;
    setActiveFromChild?: boolean;
    dropup?: boolean;
    class?: string;
  }

  export class Dropdown extends SvelteComponent<DropdownProps, any, any> {}
}
