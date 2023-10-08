declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface FormProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['form']> {
  inline?: boolean;
  validated?: boolean;
class?: string;
}

export class Form extends SvelteComponent<
  FormProps,
  { submit: WindowEventMap['submit'] },
  any
> {}

}
