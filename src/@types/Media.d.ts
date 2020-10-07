import { LocalSvelteComponent } from './shared';

export interface IMediaProps {
  body?: boolean;
  bottom?: boolean;
  heading?: boolean;
  left?: boolean;
  list?: boolean;
  middle?: boolean;
  object?: boolean;
  right?: boolean;
  top?: boolean;
  src?: string;
  href?: string;
  alt?: string;
}

declare class Media extends LocalSvelteComponent<IMediaProps> {}
export default Media;
