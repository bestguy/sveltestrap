import { SvelteComponentTyped } from 'svelte';
import { ContainerType } from './shared';

declare type TooltipPlacement = 'left' | 'top' | 'bottom' | 'right';

export interface TooltipProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  animation?: boolean;
  container?: ContainerType;
  isOpen?: boolean;
  placement?: TooltipPlacement;
  target: string | Element;
}

export default class Tooltip extends SvelteComponentTyped<
  TooltipProps,
  {},
  { default: {} }
> {}
