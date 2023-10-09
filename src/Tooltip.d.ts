declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';
import type { ContainerType } from './shared.d.ts';

declare type TooltipPlacement = 'left' | 'top' | 'bottom' | 'right';

export interface TooltipProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  animation?: boolean;
  container?: ContainerType;
  isOpen?: boolean;
  placement?: TooltipPlacement;
  target: string | HTMLElement;
class?: string;
}

export class Tooltip extends SvelteComponent<
  TooltipProps,
  any,
  any
> {}

}
