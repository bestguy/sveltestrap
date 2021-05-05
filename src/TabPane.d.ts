import { SvelteComponentTyped } from 'svelte';

export interface ITabPaneProps {
  tabId?: number | string;
}

declare class TabPane extends SvelteComponentTyped<ITabPaneProps> {}
export default TabPane;
