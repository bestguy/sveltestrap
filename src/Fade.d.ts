import { SvelteComponentTyped } from 'svelte';

export interface IFadeProps {
  onEntering?: () => void;
  onEntered?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
  toggler?: string;
}

declare class Fade extends SvelteComponentTyped<IFadeProps> {}
export default Fade;
