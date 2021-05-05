import { SvelteComponentTyped } from 'svelte';

export interface ITabContentProps {
  activeTab?: number | string;
}

declare class TabContent extends SvelteComponentTyped<ITabContentProps> {}
export default TabContent;
