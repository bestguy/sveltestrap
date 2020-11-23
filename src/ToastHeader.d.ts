import * as React from 'react';
import { LocalSvelteComponent } from './shared';

export interface IToastHeaderProps {
  toggle?: () => void;
  icon?: any;
  close?: React.ReactNode;
  charCode?: string | number;
  closeAriaLabel?: string;
}

declare class ToastHeader extends LocalSvelteComponent<IToastHeaderProps> {}
export default ToastHeader;
