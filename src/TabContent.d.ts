declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface TabContentProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    pills?: boolean;
    vertical?: boolean;
    class?: string;
  }

  export class TabContent extends SvelteComponent<
    TabContentProps,
    {
      tab: CustomEvent<number | string>;
    },
    any
  > {}
}
