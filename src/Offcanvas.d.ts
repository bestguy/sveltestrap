declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';
  import type { ContainerType } from './shared.d.ts';

  declare type Placement = 'start' | 'end' | 'top' | 'bottom'; // TODO support left & right alias

  export interface OffcanvasProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    backdrop?: boolean;
    body?: boolean;
    container?: ContainerType;
    fade?: boolean;
    header?: string;
    isOpen: boolean;
    placement?: Placement;
    scroll?: boolean;
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
    xl?: boolean;
    xxl?: boolean;
    toggle?: () => void;
    class?: string;
  }

  export class Offcanvas extends SvelteComponent<
    OffcanvasProps,
    {
      open: CustomEvent<void>;
      opening: CustomEvent<void>;
      closing: CustomEvent<void>;
      close: CustomEvent<void>;
    },
    {
      default: {};
      header: {};
    }
  > {}
}
