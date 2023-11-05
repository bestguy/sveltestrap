declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface PortalProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    class?: string;
  }

  export class Portal extends SvelteComponent<PortalProps, any, any> {}
}
