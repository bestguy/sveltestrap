declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface ImageProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['img']> {
    figure?: boolean;
    fluid?: boolean;
    thumbnail?: boolean;
    class?: string;
  }

  export class Image extends SvelteComponent<ImageProps, any, any> {}
}
