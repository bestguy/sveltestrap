import { IFadeProps } from './Fade';
import { LocalSvelteComponent } from './shared';
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

declare class Alert extends LocalSvelteComponent<IAlertProps> {}
export default Alert;
