import { SvelteComponentTyped } from 'svelte';

export interface TabContentProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  activeTab?: number | string;
  pills?: boolean;
  vertical?: boolean;
}

export default class TabContent extends SvelteComponentTyped<
  TabContentProps,
  {},
  { default: {} }
> {}
