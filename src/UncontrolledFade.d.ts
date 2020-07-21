import { LocalSvelteComponent } from './shared';
import { IFadeProps } from './Fade';

export interface IUncontrolledFadeProps extends IFadeProps {
  defaultOption?: boolean;
  toggler?: string;

  onEntering?: () => void;
  onEntered?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
}

declare class Fade extends LocalSvelteComponent<IUncontrolledFadeProps> {}
export default Fade;
