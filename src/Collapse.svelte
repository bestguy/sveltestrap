<script>
  import clsx from 'clsx';
  import { clean } from './utils';

  import { createEventDispatcher } from 'svelte';
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
  export let expand = false;

  const props = clean($$props);

  $: classes = clsx(
    className,
    // collapseClass,
    navbar && 'navbar-collapse',
  );

  let windowWidth = window.innerWidth;
  let _wasMaximazed = false;

  const minWidth = {};
  minWidth['xs'] = 0;
  minWidth['sm'] = 576;
  minWidth['md'] = 768;
  minWidth['lg'] = 992;
  minWidth['xl'] = 1200;

  const dispatch = createEventDispatcher();

  function notify() {
    dispatch('update', {
      isOpen: isOpen
    });
  }

  $: if (navbar && expand) {
    if (windowWidth >= minWidth[expand] && !isOpen) {
      isOpen = true;
      _wasMaximazed = true;
      notify();
    } else if (windowWidth < minWidth[expand] && _wasMaximazed) {
      isOpen = false;
      _wasMaximazed = false;
      notify();
    }
  }

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
