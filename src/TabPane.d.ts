declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface TabPaneProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    active?: boolean;
    tab?: string;
    disabled?: boolean;
    tabId?: number | string;
    class?: string;
  }

  export class TabPane extends SvelteComponent<
    TabPaneProps,
    any,
    { default: {}; tab: {} }
  > {}
}
