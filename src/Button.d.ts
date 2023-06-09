import { SvelteComponentTyped } from 'svelte';

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
}

export default class Button extends SvelteComponentTyped<
  ButtonProps,
  { click: WindowEventMap['click'] },
  { default: {} }
> {}
