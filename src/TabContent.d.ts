import { SvelteComponentTyped } from 'svelte';

export interface TabContentProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
  activeTab?: number | string;
}

export default class TabContent extends SvelteComponentTyped<
  TabContentProps,
  {},
  { default: {} }
> {}
