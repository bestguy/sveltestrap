import { SvelteComponentTyped } from 'svelte';

export interface IFormFeedbackProps {
  valid?: boolean;
  tooltip?: boolean;
}

declare class FormFeedback extends SvelteComponentTyped<IFormFeedbackProps> {}
export default FormFeedback;
