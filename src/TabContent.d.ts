import { SvelteComponentTyped } from 'svelte';

export interface TabContentProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  pills?: boolean;
  vertical?: boolean;
}

export default class TabContent extends SvelteComponentTyped<
  TabContentProps,
  {},
  { default: {} }
> {}
