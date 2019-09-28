<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  import { slide } from 'svelte/transition';
  const noop = () => undefined;

  export let isOpen = false;
  let className = '';
  export { className as class };
  export let navbar = false;
  export let onEntering = noop;
  export let onEntered = noop;
  export let onExiting = noop;
  export let onExited = noop;

  const props = clean($$props);
  let _wasOpen = isOpen;
  $: classes = clsx(
    className,
    // collapseClass,
    navbar && 'navbar-collapse',
  );

  // TODO if navbar, then need to close when transitioning from md -> sm breakpoints.
  // Can't hardcode 768, etc, as those can be diffrent in diffent themes.
  // Needs to be breakpoint when navbar-toggler is display: block|none
</script>

{#if isOpen}
  <div
    transition:slide
    on:introstart
    on:introend
    on:outrostart
    on:outroend
    on:introstart="{onEntering}"
    on:introend="{onEntered}"
    on:outrostart="{onExiting}"
    on:outroend="{onExited}"
    class="{classes}"
    {...props}
  >
    <slot />
  </div>
{/if}
