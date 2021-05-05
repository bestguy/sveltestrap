import { SvelteComponentTyped } from 'svelte';

export interface IToastProps {
  isOpen?: boolean;
  fade?: boolean;
  duration?: number;
}

declare class Toast extends SvelteComponentTyped<IToastProps> {}
export default Toast;
