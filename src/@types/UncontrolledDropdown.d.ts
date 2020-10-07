import { IDropdownProps } from './Dropdown';
import { LocalSvelteComponent } from './shared';

export interface IUncontrolledDropdownProps extends IDropdownProps {
  defaultOpen?: boolean;
  onToggle?: (event: () => void, isOpen: boolean) => void;
}

declare class UncontrolledDropdown extends LocalSvelteComponent<
  IUncontrolledDropdownProps
> {}

export default UncontrolledDropdown;
