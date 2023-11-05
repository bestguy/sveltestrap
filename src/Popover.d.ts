declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';
  import type { ContainerType } from './shared.d.ts';

  declare type PopoverPlacement = 'left' | 'top' | 'bottom' | 'right';
  declare type Triggers = 'click' | 'hover' | 'focus';

  export interface PopoverProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    animation?: boolean;
    container?: ContainerType;
    dismissible?: boolean;
    isOpen?: boolean;
    placement?: PopoverPlacement;
    target: string;
    title?: string;
    trigger?: Triggers;
    class?: string;
  }

  export class Popover extends SvelteComponent<
    PopoverProps,
    any,
    { default: {}; title: {} }
  > {}
}
