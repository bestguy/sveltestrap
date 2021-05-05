import { SvelteComponentTyped } from 'svelte';

export interface IInputGroupAddonProps {
  addonType: 'prepend' | 'append';
}

declare class InputGroupAddon extends SvelteComponentTyped<
  IInputGroupAddonProps
> {}
export default InputGroupAddon;
