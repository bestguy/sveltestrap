import { SvelteComponentTyped } from 'svelte';
import { ContainerType } from './shared';

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
}

export default class Popover extends SvelteComponentTyped<
  PopoverProps,
  {},
  { default: {}; title: {} }
> {}
