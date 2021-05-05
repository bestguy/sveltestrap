import { SvelteComponentTyped } from 'svelte';
import { TextColor } from './shared';

export interface FormTextProps {
  inline?: boolean;
  color?: TextColor;
}

declare class FormText extends SvelteComponentTyped<FormTextProps> {}
export default FormText;
