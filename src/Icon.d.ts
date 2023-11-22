declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface IconProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['i']> {
    name: string;
    class?: string;
  }

  export class Icon extends SvelteComponent<IconProps, any, any> {}
}
