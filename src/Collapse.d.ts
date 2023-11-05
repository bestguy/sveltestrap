declare module 'sveltestrap' {
  import { SvelteComponent } from 'svelte';

  export interface CollapseProps
    extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    expand?: boolean | string;
    horizontal?: boolean;
    isOpen?: boolean;
    navbar?: boolean;
    onEntered?: () => void;
    onEntering?: () => void;
    onExited?: () => void;
    onExiting?: () => void;
    toggler?: string;
    class?: string;
  }

  export class Collapse extends SvelteComponent<
    CollapseProps,
    {
      open: CustomEvent<void>;
      opening: CustomEvent<void>;
      closing: CustomEvent<void>;
      close: CustomEvent<void>;
      update: CustomEvent<boolean>;
    },
    any
  > {}
}
