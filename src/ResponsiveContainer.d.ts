import { SvelteComponentTyped } from 'svelte';

export interface ResponsiveContainerProps {
  responsive?: boolean;
}

export default class ResponsiveContainer extends SvelteComponentTyped<
  ResponsiveContainerProps,
  {},
  { default: {} }
> {}
