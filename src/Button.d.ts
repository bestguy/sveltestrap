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
export interface IButtonProps {
  active?: boolean;
  block?: boolean;
  close?: boolean;
  color?: ButtonColor;
  disabled?: boolean;
  href?: string;
  outline?: boolean;
  size?: ButtonSize;
}

/**
 * Bootstrap Button
 */
declare class Button extends SvelteComponentTyped<IButtonProps> {}

export default Button;
