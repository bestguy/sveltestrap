import { SvelteComponentTyped } from 'svelte';
import { ButtonProps } from './Button';

export interface NavbarTogglerProps extends ButtonProps {}

export default class NavbarToggler extends SvelteComponentTyped<
  NavbarTogglerProps,
  { click: WindowEventMap['click'] },
  { default: {} }
> {}
