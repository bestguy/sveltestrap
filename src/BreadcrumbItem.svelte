<script>
  import classnames from './utils.ts';

  let className = '';
  export { className as class };
  export let active = false;
  export let children = undefined;

  $: classes = classnames(
    className,
    active ? 'active' : false,
    'breadcrumb-item'
  );
</script>

<li {...$$restProps} class={classes} aria-current={active ? 'page' : undefined}>
  {#if children}
    {children}
  {:else}
    <slot />
  {/if}
</li>
