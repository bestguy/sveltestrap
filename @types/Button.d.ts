import { LocalSvelteComponent } from '.';

export declare type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';
export declare type ButtonSize = 'lg' | 'sm';
export interface IButtonProps {
  color?: ButtonColor;
  size?: ButtonSize;
  outline?: boolean;
  disabled?: boolean;
  active?: boolean;
}

/**
 * Bootstrap Button
 */
declare class Button extends LocalSvelteComponent<IButtonProps> {}

export default Button;
