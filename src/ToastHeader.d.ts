import { SvelteComponentTyped } from 'svelte';

export interface IToastHeaderProps {
  toggle?: () => void;
  icon?: any;
  closeAriaLabel?: string;
}

declare class ToastHeader extends SvelteComponentTyped<IToastHeaderProps> {}
export default ToastHeader;
