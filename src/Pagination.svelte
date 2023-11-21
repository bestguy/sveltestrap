<script>
  import classnames from './utils.ts';

  let className = '';
  export { className as class };
  export let listClassName = '';
  export let size = '';
  export let ariaLabel = 'pagination';

  $: classes = classnames(className);

  $: listClasses = classnames(listClassName, 'pagination', {
    [`pagination-${size}`]: !!size
  });
</script>

<nav {...$$restProps} class={classes} aria-label={ariaLabel}>
  <ul class={listClasses}>
    <slot />
  </ul>
</nav>
