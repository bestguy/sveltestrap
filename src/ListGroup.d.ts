import { LocalSvelteComponent } from './shared';

export interface IListGroupProps {
  flush?: boolean;
}

declare class ListGroup extends LocalSvelteComponent<IListGroupProps> {}
export default ListGroup;
