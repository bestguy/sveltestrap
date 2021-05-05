import { SvelteComponentTyped } from 'svelte';

export interface IToastHeaderProps {
  toggle?: () => void;
  icon?: any;
  charCode?: string | number;
  closeAriaLabel?: string;
}

declare class ToastHeader extends SvelteComponentTyped<IToastHeaderProps> {}
export default ToastHeader;
