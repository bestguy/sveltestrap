declare module 'sveltestrap' {
import type { FadeProps } from './Fade.d.ts';
import { SvelteComponent } from 'svelte';
import type { Color } from './shared.d.ts';

export interface AlertProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  closeAriaLabel?: string;
  closeClassName?: string;
  color?: Color;
  dismissible?: boolean;
  fade?: boolean;
  heading?: string;
  isOpen?: boolean;
  toggle?: () => void;
  transition?: FadeProps;
class?: string;
}

export class Alert extends SvelteComponent<
  AlertProps,
  any,
  { default: {}; heading: {} }
> {}

}
