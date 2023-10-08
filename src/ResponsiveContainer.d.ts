declare module 'sveltestrap' {
import { SvelteComponent } from 'svelte';

export interface ResponsiveContainerProps {
  responsive?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
class?: string;
}

export class ResponsiveContainer extends SvelteComponent<
  ResponsiveContainerProps,
  any,
  any
> {}

}
