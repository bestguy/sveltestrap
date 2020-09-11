import { LocalSvelteComponent } from './shared';

export interface IconProps {
  class?: string;
  color?: string;
  name: string;
  size?: string | number;
  url?: string;
}

declare class Icon extends LocalSvelteComponent<IconProps> {}
export default Icon;
