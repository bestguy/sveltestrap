import { LocalSvelteComponent } from './shared';

export interface IFormProps {
  inline?: boolean;
}

declare class Form extends LocalSvelteComponent<IFormProps> {}
export default Form;
