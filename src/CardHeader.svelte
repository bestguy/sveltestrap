<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let id = undefined;
  export let tag = 'div';

  $: classes = classnames(className, 'card-header');
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
