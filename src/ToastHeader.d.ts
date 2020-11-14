import { LocalSvelteComponent } from './shared';

export interface IToastHeaderProps {
  toggle?: () => void;
  icon?: any;
  closeAriaLabel?: string;
}

declare class ToastHeader extends LocalSvelteComponent<IToastHeaderProps> {}
export default ToastHeader;
