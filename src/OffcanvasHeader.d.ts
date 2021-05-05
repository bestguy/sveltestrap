import { SvelteComponentTyped } from 'svelte';

export interface OffcanvasHeaderProps {
  closeAriaLabel?: string;
  toggle?: () => void;
}

declare class OffcanvasHeader extends SvelteComponentTyped<OffcanvasHeaderProps> {}
export default OffcanvasHeader;
