import { LocalSvelteComponent } from './shared';

export interface IJumbotronProps {
  tag?: string;
  fluid?: boolean;
}

declare class Jumbotron extends LocalSvelteComponent<IJumbotronProps> {}
export default Jumbotron;
