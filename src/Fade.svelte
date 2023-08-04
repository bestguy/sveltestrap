<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import toggle from './toggle';

  const dispatch = createEventDispatcher();

  export let isOpen = false;
  let className = '';
  export { className as class };
  export let onEntering = () => dispatch('opening');
  export let onEntered = () => dispatch('open');
  export let onExiting = () => dispatch('closing');
  export let onExited = () => dispatch('close');
  export let toggler = null;

  onMount(() =>
    toggle(toggler, (e) => {
      isOpen = !isOpen;
      e.preventDefault();
    })
  );
</script>

{#if isOpen}
  <div
    {...$$restProps}
    transition:fade|local
    on:introstart
    on:introend
    on:outrostart
    on:outroend
    on:introstart={onEntering}
    on:introend={onEntered}
    on:outrostart={onExiting}
    on:outroend={onExited}
    class={className}
  >
    <slot />
  </div>
{/if}
