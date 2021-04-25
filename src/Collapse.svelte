<script>  
  import { createEventDispatcher, onMount } from 'svelte';
  import classnames from './utils';
  import { slide } from 'svelte/transition';
  import toggle from './toggle';

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
  export let toggler = null;

  onMount(() => toggle(toggler, () => isOpen = !isOpen));

  $: classes = classnames(
    className,
    // collapseClass,
    navbar && 'navbar-collapse'
  );

  let windowWidth = 0;
  let _wasMaximized = false;

  // TODO wrong to hardcode these here - come from Bootstrap CSS only
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
      _wasMaximized = true;
      notify();
    } else if (windowWidth < minWidth[expand] && _wasMaximized) {
      isOpen = false;
      _wasMaximized = false;
      notify();
    }
  }
</script>

<svelte:window bind:innerWidth={windowWidth} />

{#if isOpen}
  <div
    style={navbar ? undefined : 'overflow: hidden;'}
    {...$$restProps}
    class={classes}
    transition:slide|local
    on:introstart
    on:introend
    on:outrostart
    on:outroend
    on:introstart={onEntering}
    on:introend={onEntered}
    on:outrostart={onExiting}
    on:outroend={onExited}>
    <slot />
  </div>
{/if}
