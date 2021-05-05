import { SvelteComponentTyped } from 'svelte';

export interface FormGroupProps {
  row?: boolean;
  check?: boolean;
  inline?: boolean;
  disabled?: boolean;
  id?: string;
  tag?: string;
}

declare class FormGroup extends SvelteComponentTyped<FormGroupProps> {}
export default FormGroup;
