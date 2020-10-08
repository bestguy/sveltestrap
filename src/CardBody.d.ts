import { LocalSvelteComponent } from './shared';

export interface ICardBodyProps {
  id?: string;
}

declare class CardBody extends LocalSvelteComponent<ICardBodyProps> {}
export default CardBody;
