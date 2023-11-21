<script>
  // TODO only allow single backdrop open at once.
  import classnames from './utils.ts';
  import { backdropIn, backdropOut } from './transitions.ts';
  let className = '';
  export { className as class };
  export let isOpen = false;
  export let fade = true;
  $: classes = classnames(className, 'offcanvas-backdrop');
</script>

{#if isOpen}
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
