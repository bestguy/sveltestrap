import * as React from 'react';
import { FadeProps } from './Fade';

export interface UncontrolledAlertProps
  extends React.HTMLAttributes<HTMLElement> {
  [key: string]: any;
  color?: string;
  tag?: string | React.ReactType;
  transition?: FadeProps;
}
export interface AlertProps extends UncontrolledAlertProps {
  isOpen?: boolean;
  toggle?: React.MouseEventHandler<any>;
}

declare class Alert<T = { [key: string]: any }> extends React.Component<
  AlertProps
> {}
export default Alert;
