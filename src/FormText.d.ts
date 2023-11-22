declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';
  import type { TextColor } from './shared.d.ts';

  export interface FormTextProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['small']> {
    color?: TextColor;
    inline?: boolean;
    class?: string;
  }

  export class FormText extends SvelteComponent<FormTextProps, any, any> {}
}
