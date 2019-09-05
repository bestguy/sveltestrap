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

  let windowWidth = window.innerWidth;

  $: if (windowWidth >= 768 && navbar && _wasOpen === isOpen) {
    _wasOpen = isOpen;
    isOpen = true;
  } else if (windowWidth < 768) {
    isOpen = _wasOpen;
  }
</script>

<svelte:window bind:innerWidth="{windowWidth}" />

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
