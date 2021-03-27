import { LocalSvelteComponent } from './shared';

export interface IListGroupProps {
  flush?: boolean;
  numbered?: boolean;
}

declare class ListGroup extends LocalSvelteComponent<IListGroupProps> {}
export default ListGroup;
