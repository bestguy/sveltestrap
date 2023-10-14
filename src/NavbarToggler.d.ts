declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';
import type { ButtonProps } from './Button.d.ts';

export interface NavbarTogglerProps extends ButtonProps {class?: string;
}

export class NavbarToggler extends SvelteComponent<
  NavbarTogglerProps,
  { click: WindowEventMap['click'] },
  any
> {}

}
