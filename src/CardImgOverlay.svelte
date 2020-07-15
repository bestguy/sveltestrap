<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };


  $: classes = clsx(className, 'card-img-overlay');
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
