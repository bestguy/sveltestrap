declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface ICardHeaderProps {
    id?: string;
    tag?: 'div' | 'h3';
  }

  declare class CardHeader extends SvelteComponent<ICardHeaderProps> {}
  export default CardHeader;
}
