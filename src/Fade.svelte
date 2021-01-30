<script>
  import { fade } from 'svelte/transition';
  const noop = () => undefined;

  export let isOpen = false;
  let className = '';
  export { className as class };
  export let onEntering = noop;
  export let onEntered = noop;
  export let onExiting = noop;
  export let onExited = noop;
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
    class={className}>
    <slot />
  </div>
{/if}
