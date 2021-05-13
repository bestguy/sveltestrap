import { FadeProps } from './Fade';
import { SvelteComponentTyped } from 'svelte';
import { Color } from './shared';

export interface AlertProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  closeAriaLabel?: string;
  closeClassName?: string;
  color?: Color;
  dismissible?: boolean;
  fade?: boolean;
  isOpen?: boolean;
  toggle?: () => void;
  transition?: FadeProps;
}

export default class Alert extends SvelteComponentTyped<
  AlertProps,
  {},
  { default: {} }
> {}
