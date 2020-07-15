<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };


  $: classes = clsx(className, 'card-subtitle');
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
