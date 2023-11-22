declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface ColgroupProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['colgroup']> {
    footer?: undefined;
    header?: undefined;
    width?: undefined;
    class?: string;
  }

  export class Colgroup extends SvelteComponent<ColgroupProps, any, any> {}
}
