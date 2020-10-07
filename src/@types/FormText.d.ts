import { Color, LocalSvelteComponent } from './shared';

export interface FormTextProps {
  inline?: boolean;
  color?: Color;
}

declare class FormText extends LocalSvelteComponent<FormTextProps> {}
export default FormText;
