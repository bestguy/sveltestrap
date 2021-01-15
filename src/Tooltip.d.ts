import { LocalSvelteComponent } from './shared';

declare type TooltipPlacement = 'left' | 'top' | 'bottom' | 'right';

interface ITooltipProps {
  animation?: boolean;
  isOpen?: boolean;
  placement?: TooltipPlacement;
  target: string;
}

declare class Tooltip extends LocalSvelteComponent<ITooltipProps> {}

export default Tooltip;
