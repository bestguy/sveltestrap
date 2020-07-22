import { LocalSvelteComponent } from './shared';

export interface IUncontrolledCollapseProps {
  defaultOpen?: boolean;
  toggler?: string;

  onEntering?: () => void;
  onEntered?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
}

declare class UncontrolledCollapse extends LocalSvelteComponent<
  IUncontrolledCollapseProps
> {}
export default UncontrolledCollapse;
