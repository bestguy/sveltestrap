import { SvelteComponentTyped } from 'svelte';

export interface IFormProps {
  inline?: boolean;
}

declare class Form extends SvelteComponentTyped<IFormProps> {}
export default Form;
