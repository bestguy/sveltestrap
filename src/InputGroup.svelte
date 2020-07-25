<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let size = '';

  $: classes = classnames(
    className,
    'input-group',
    size ? `input-group-${size}` : null
  );
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
