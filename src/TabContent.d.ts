import { LocalSvelteComponent } from './shared';

export interface ITabContentProps {
  activeTab?: number | string;
}

declare class TabContent extends LocalSvelteComponent<ITabContentProps> {}
export default TabContent;
