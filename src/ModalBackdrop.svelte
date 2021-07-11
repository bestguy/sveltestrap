<script>
  // TODO only allow single backdrop open at once.
  import classnames from './utils';
  import { backdropIn, backdropOut } from './transitions.js';
  let className = '';
  export { className as class };
  export let isOpen = false;
  export let fade = true;
  $: classes = classnames(className, 'modal-backdrop');
</script>

{#if isOpen}
  <div
    {...$$restProps}
    on:click
    class={classes}
    class:fade
    in:backdropIn
    out:backdropOut
  />
{/if}
