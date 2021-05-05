import { SvelteComponentTyped } from 'svelte';

export interface IJumbotronProps {
  tag?: string;
  fluid?: boolean;
}

declare class Jumbotron extends SvelteComponentTyped<IJumbotronProps> {}
export default Jumbotron;
