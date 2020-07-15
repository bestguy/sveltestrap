<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let ariaLabel = 'breadcrumb';
  export let children = undefined;
  export let listClassName = '';


  $: listClasses = clsx('breadcrumb', listClassName);
</script>

<nav {...$$restProps} aria-label={ariaLabel} class={className}>
  <ol class={listClasses}>
    {#if children}
      {children}
    {:else}
      <slot />
    {/if}
  </ol>
</nav>
