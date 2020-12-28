import { LocalSvelteComponent } from './shared';

declare type TooltipPlacement = 'left' | 'top' | 'bottom' | 'right';

interface ITooltipProps {
  animation?: boolean;
  target?: string;
  placement?: TooltipPlacement;
}

declare class Tooltip extends LocalSvelteComponent<ITooltipProps> {}

export default Tooltip;
