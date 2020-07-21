import { LocalSvelteComponent } from './shared';

export declare interface IUncontrolledButtonDropdownProps {
  direction?: string;
  disabled?: boolean;
  group?: boolean;
  nav?: boolean;
  active?: boolean;
  addonType?: boolean;
  size?: string;
  inNavbar?: boolean;
  setActiveFromChild?: boolean;
  dropup?: boolean;
  defaultOpen?: boolean;
}

export class UncontrolledButtonDropdown extends LocalSvelteComponent<
  IUncontrolledButtonDropdownProps
> {}
