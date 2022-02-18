<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { collapseIn, collapseOut } from './transitions';
  import classnames from './utils';
  import toggle from './toggle';

  const dispatch = createEventDispatcher();

  export let isOpen = false;
  let className = '';
  export { className as class };
  export let horizontal = false;
  export let navbar = false;
  export let onEntering = () => dispatch('opening');
  export let onEntered = () => dispatch('open');
  export let onExiting = () => dispatch('closing');
  export let onExited = () => dispatch('close');
  export let expand = false;
  export let toggler = null;

  onMount(() => toggle(toggler, (e) => {
    isOpen = !isOpen;
    e.preventDefault();
  }));

  $: classes = classnames(className, {
    'collapse-horizontal': horizontal,
    'navbar-collapse': navbar
  });

  let windowWidth = 0;
  let _wasMaximized = false;

  // TODO wrong to hardcode these here - come from Bootstrap CSS only
  const minWidth = {};
  minWidth['xs'] = 0;
  minWidth['sm'] = 576;
  minWidth['md'] = 768;
  minWidth['lg'] = 992;
  minWidth['xl'] = 1200;

  function notify() {
    dispatch('update', isOpen);
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
    in:collapseIn={{ horizontal }}
    out:collapseOut|local={{ horizontal }}
    on:introstart
    on:introend
    on:outrostart
    on:outroend
    on:introstart={onEntering}
    on:introend={onEntered}
    on:outrostart={onExiting}
    on:outroend={onExited}
  >
    <slot />
  </div>
{/if}
