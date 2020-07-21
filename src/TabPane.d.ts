import { LocalSvelteComponent } from './shared';

export interface ITabPaneProps {
  tabId?: number | string;
}

declare class TabPane extends LocalSvelteComponent<ITabPaneProps> {}
export default TabPane;
