import { LocalSvelteComponent } from './shared';

export interface OffcanvasHeaderProps {
  closeAriaLabel?: string;
  toggle?: () => void;
}

declare class OffcanvasHeader extends LocalSvelteComponent<OffcanvasHeaderProps> {}
export default OffcanvasHeader;
