import { LocalSvelteComponent } from './shared';

declare type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';
declare type ButtonSize = 'lg' | 'sm';
interface IButtonProps {
  active?: boolean;
  block?: boolean;
  close?: boolean;
  color?: ButtonColor;
  disabled?: boolean;
  href?: boolean;
  outline?: boolean;
  size?: ButtonSize;
}

/**
 * Bootstrap Button
 */
declare class Button extends LocalSvelteComponent<IButtonProps> {}

export default Button;
