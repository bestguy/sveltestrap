<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };


  $: classes = clsx(className, 'card-title');
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
