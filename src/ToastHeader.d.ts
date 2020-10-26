import { LocalSvelteComponent } from './shared';

export interface IToastHeaderProps {
  toggle?: () => void;
  icon?: any;
  close?: React.ReactNode;
  closeAriaLabel?: string;
}

declare class ToastHeader extends LocalSvelteComponent<IToastHeaderProps> {}
export default ToastHeader;
