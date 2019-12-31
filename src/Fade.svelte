<script>
  import { clean } from './utils';

  import { fade } from 'svelte/transition';
  const noop = () => undefined;

  export let isOpen = false;
  let className = '';
  export { className as class };
  export let onEntering = noop;
  export let onEntered = noop;
  export let onExiting = noop;
  export let onExited = noop;

  const props = clean($$props);
</script>

{#if isOpen}
  <div
    {...props}
    transition:fade
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
