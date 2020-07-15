<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let size = '';


  $: classes = clsx(
    className,
    'input-group',
    size ? `input-group-${size}` : null
  );
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
