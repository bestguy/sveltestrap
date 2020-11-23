import { LocalSvelteComponent } from './shared';

export interface IToastHeaderProps {
  toggle?: () => void;
  icon?: any;
  charCode?: string | number;
  closeAriaLabel?: string;
}

declare class ToastHeader extends LocalSvelteComponent<IToastHeaderProps> {}
export default ToastHeader;
