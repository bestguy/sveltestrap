<script>
  import classnames from './utils.ts';

  let className = '';
  export { className as class };
  export let tag = 'div';

  $: classes = classnames(className, 'card-header');
</script>

{#if tag === 'h3'}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <h3 {...$$restProps} class={classes} on:click>
    <slot />
  </h3>
{:else}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div {...$$restProps} class={classes} on:click>
    <slot />
  </div>
{/if}
