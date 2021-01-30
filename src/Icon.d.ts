import { LocalSvelteComponent } from './shared';

export interface IIconProps {
  name: string;
}

declare class Icon extends LocalSvelteComponent<IIconProps> {}
export default Icon;
