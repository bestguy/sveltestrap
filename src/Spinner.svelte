<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let type = 'border';
  export let size = '';
  export let color = '';
  let x = null;
  $: classes = classnames(
    className,
    size ? `spinner-${type}-${size}` : false,
    `spinner-${type}`,
    color ? `text-${color}` : false
  );
</script>

<div {...$$restProps} role="status" class={classes}>
  <span class="visually-hidden">
    <slot>Loading...</slot>
  </span>
</div>
