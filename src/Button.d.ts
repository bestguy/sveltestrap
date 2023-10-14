declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

declare type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link';

declare type ButtonSize = 'lg' | 'sm';

export interface ButtonProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['button']> {
  active?: boolean;
  block?: boolean;
  close?: boolean;
  color?: ButtonColor;
  disabled?: boolean;
  href?: string;
  inner?: HTMLElement;
  outline?: boolean;
  size?: ButtonSize;
class?: string;
}

export class Button extends SvelteComponent<
  ButtonProps,
  { click: WindowEventMap['click'] },
  any
> {}

}
