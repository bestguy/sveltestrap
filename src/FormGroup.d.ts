import { LocalSvelteComponent } from './shared';

export interface FormGroupProps {
  row?: boolean;
  check?: boolean;
  inline?: boolean;
  disabled?: boolean;
  id?: string;
  tag?: string;
}

declare class FormGroup extends LocalSvelteComponent<FormGroupProps> {}
export default FormGroup;
