import { SvelteComponentTyped } from 'svelte';

export interface TabPaneProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  active?: boolean;
  tab?: string;
  disabled?: boolean;
  tabId?: number | string;
}

export default class TabPane extends SvelteComponentTyped<
  TabPaneProps,
  {},
  { default: {}; tab: {} }
> {}
