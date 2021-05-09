import { SvelteComponentTyped } from 'svelte';

export interface TabPaneProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  tabId?: number | string;
}

export default class TabPane extends SvelteComponentTyped<
  TabPaneProps,
  {},
  { default: {} }
> {}
