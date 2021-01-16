import { LocalSvelteComponent } from './shared';

declare type PopoverPlacement = 'left' | 'top' | 'bottom' | 'right';
declare type Triggers = 'click' | 'hover' | 'focus';

interface IPopoverProps {
  animation?: boolean;
  children?: string;
  isOpen?: boolean;
  placement?: PopoverPlacement;
  target: string;
  title?: string;
  trigger?: Triggers;
}

declare class Popover extends LocalSvelteComponent<IPopoverProps> {}

export default Popover;
