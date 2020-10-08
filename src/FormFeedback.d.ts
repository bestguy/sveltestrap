import { LocalSvelteComponent } from './shared';

export interface IFormFeedbackProps {
  valid?: boolean;
  tooltip?: boolean;
}

declare class FormFeedback extends LocalSvelteComponent<IFormFeedbackProps> {}
export default FormFeedback;
