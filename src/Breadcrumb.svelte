<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let children = undefined;
  export let divider = undefined;
  export let listClassName = '';
  export let style = undefined;

  $: listClasses = classnames('breadcrumb', listClassName);
  $: styles = divider
    ? `--bs-breadcrumb-divider: '${divider}'; ${style || ''}`
    : style;
</script>

<nav style={styles} {...$$restProps} class={className}>
  <ol class={listClasses}>
    {#if children}
      {children}
    {:else}
      <slot />
    {/if}
  </ol>
</nav>
