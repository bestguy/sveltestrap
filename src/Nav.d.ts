import { SvelteComponentTyped } from 'svelte';

export interface NavProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['ul']> {
  card?: boolean;
  fill?: boolean;
  horizontal?: string;
  justified?: boolean;
  navbar?: boolean;
  pills?: boolean;
  tabs?: boolean;
  vertical?: boolean | string;
  underline?: boolean;
}

export default class Nav extends SvelteComponentTyped<
  NavProps,
  {},
  { default: {} }
> {}
