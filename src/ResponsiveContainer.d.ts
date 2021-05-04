import { SvelteComponentTyped } from 'svelte';

export interface ResponsiveContainerProps {
  responsive?: boolean;
}

declare class ResponsiveContainer extends SvelteComponentTyped<ResponsiveContainerProps> {}
export default ResponsiveContainer;
