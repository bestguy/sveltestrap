<script>
  // TODO only allow single backdrop open at once.
  import { onMount } from 'svelte';
  import classnames from './utils.ts';
  import { backdropIn, backdropOut } from './transitions.ts';

  let className = '';
  export { className as class };
  export let isOpen = false;
  export let fade = true;

  let loaded = false;
  onMount(() => {
    loaded = true;
  });

  $: classes = classnames(className, 'modal-backdrop');
</script>

{#if isOpen && loaded}
  <div
    role="presentation"
    {...$$restProps}
    on:click
    class={classes}
    class:fade
    in:backdropIn
    out:backdropOut
  />
{/if}
