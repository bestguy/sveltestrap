import { SvelteComponentTyped } from 'svelte';
import { ContainerType } from './shared';

declare type PopoverPlacement = 'left' | 'top' | 'bottom' | 'right';
declare type Triggers = 'click' | 'hover' | 'focus';

interface IPopoverProps {
  animation?: boolean;
  children?: string;
  container?: ContainerType;
  dismissible?: boolean;
  isOpen?: boolean;
  placement?: PopoverPlacement;
  target: string;
  title?: string;
  trigger?: Triggers;
}

declare class Popover extends SvelteComponentTyped<IPopoverProps> {}

export default Popover;
