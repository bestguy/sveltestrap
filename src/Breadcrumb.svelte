<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let children = undefined;
  export let listClassName = '';

  $: listClasses = classnames('breadcrumb', listClassName);
</script>

<nav {...$$restProps} class={className}>
  <ol class={listClasses}>
    {#if children}
      {children}
    {:else}
      <slot />
    {/if}
  </ol>
</nav>
