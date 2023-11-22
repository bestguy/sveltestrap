declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface ContainerProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    id?: string;
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
    xl?: boolean;
    xxl?: boolean;
    fluid?: boolean | string;
    class?: string;
  }

  export class Container extends SvelteComponent<ContainerProps, any, any> {}
}
