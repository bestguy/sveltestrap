<script>
  import classnames from './utils.ts';

  let className = '';
  export { className as class };
  export let flush = false;
  export let horizontal = false;
  export let numbered = false;

  $: classes = classnames(className, 'list-group', {
    'list-group-flush': flush,
    'list-group-horizontal': horizontal,
    'list-group-numbered': numbered
  });
</script>

{#if numbered}
  <ol {...$$restProps} class={classes}>
    <slot />
  </ol>
{:else}
  <ul {...$$restProps} class={classes}>
    <slot />
  </ul>
{/if}
