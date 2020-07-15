<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let id = '';
  export let tag = 'div';


  $: classes = clsx(className, 'card-header');
</script>

{#if tag === 'h3'}
  <h3 {...$$restProps} {id} class={classes} on:click>
    <slot />
  </h3>
{:else}
  <div {...$$restProps} {id} class={classes} on:click>
    <slot />
  </div>
{/if}
