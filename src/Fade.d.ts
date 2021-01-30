import { LocalSvelteComponent } from './shared';

export interface IFadeProps {
  onEntering?: () => void;
  onEntered?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
}

declare class Fade extends LocalSvelteComponent<IFadeProps> {}
export default Fade;
