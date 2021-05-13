import { SvelteComponentTyped } from 'svelte';

export interface IconProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['i']> {
  name: string;
}

export default class Icon extends SvelteComponentTyped<IconProps, {}, {}> {}
