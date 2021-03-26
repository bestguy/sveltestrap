import { TextColor, LocalSvelteComponent } from './shared';

export interface FormTextProps {
  inline?: boolean;
  color?: TextColor;
}

declare class FormText extends LocalSvelteComponent<FormTextProps> {}
export default FormText;
