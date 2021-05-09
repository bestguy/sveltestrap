import { SvelteComponentTyped } from 'svelte';

export interface CardLinkProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['a']> {
  /**
   * @default ''
   */
  href?: string;
}

export default class CardLink extends SvelteComponentTyped<
  CardLinkProps,
  {},
  { default: {} }
> {}
