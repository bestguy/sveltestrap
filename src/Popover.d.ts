import { LocalSvelteComponent } from './shared';

declare type PopoverPlacement = 'left' | 'top' | 'bottom' | 'right';

interface IPopoverProps {
  animation?: boolean;
  target: string;
  placement?: PopoverPlacement;
  title?: string;
  children?: string;
}

declare class Popover extends LocalSvelteComponent<IPopoverProps> {}

export default Popover;
