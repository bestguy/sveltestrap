declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface FormFeedbackProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    tooltip?: boolean;
    valid?: boolean;
    class?: string;
  }

  export class FormFeedback extends SvelteComponent<
    FormFeedbackProps,
    any,
    any
  > {}
}
