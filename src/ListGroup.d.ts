declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface ListGroupProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['ul']> {
    flush?: boolean;
    horizontal?: boolean;
    numbered?: boolean;
    class?: string;
  }

  export class ListGroup extends SvelteComponent<ListGroupProps, any, any> {}
}
