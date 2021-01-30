import { LocalSvelteComponent } from './shared';

export interface IInputGroupAddonProps {
  addonType: 'prepend' | 'append';
}

declare class InputGroupAddon extends LocalSvelteComponent<
  IInputGroupAddonProps
> {}
export default InputGroupAddon;
