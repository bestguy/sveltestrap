declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface InputGroupProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    size?: 'sm' | 'lg';
    class?: string;
  }

  export class InputGroup extends SvelteComponent<InputGroupProps, any, any> {}
}
