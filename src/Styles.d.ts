declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface StylesProps {
    icons?: boolean;
    theme?: 'light' | 'dark' | 'auto' | undefined;
    class?: string;
  }

  export class Styles extends SvelteComponent<StylesProps, any, any> {}
}
