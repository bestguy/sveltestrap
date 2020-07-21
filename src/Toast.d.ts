import { LocalSvelteComponent } from './shared';

export interface IToastProps {
  isOpen?: boolean;
  fade?: boolean;
  duration?: number;
}

declare class Toast extends LocalSvelteComponent<IToastProps> {}
export default Toast;
