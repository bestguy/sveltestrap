import { IFadeProps } from './Fade';
import { SvelteComponentTyped } from 'svelte';
import { Color } from './shared';

export interface IAlertProps {
  color?: Color;
  closeClassName?: string;
  closeAriaLabel?: string;
  dismissible?: boolean;
  fade?: boolean;
  isOpen?: boolean;
  transition?: IFadeProps;
  toggle?: () => void;
}

declare class Alert extends SvelteComponentTyped<IAlertProps> {}
export default Alert;
