<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let size = '';
  export let vertical = false;

  $: classes = classnames(
    className,
    size ? `btn-group-${size}` : false,
    vertical ? 'btn-group-vertical' : 'btn-group'
  );
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
