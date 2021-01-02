import { LocalSvelteComponent } from './shared';

declare type PopoverPlacement = 'left' | 'top' | 'bottom' | 'right';

interface IPopoverProps {
  animation?: boolean;
  children?: string;
  isOpen?: boolean;
  placement?: PopoverPlacement;
  target: string;
  title?: string;
}

declare class Popover extends LocalSvelteComponent<IPopoverProps> {}

export default Popover;
