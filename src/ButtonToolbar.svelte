<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let ariaLabel = '';


  $: classes = clsx(className, 'btn-toolbar');
</script>

<div {...$$restProps} aria-label={ariaLabel} role="toolbar" class={classes}>
  <slot />
</div>
