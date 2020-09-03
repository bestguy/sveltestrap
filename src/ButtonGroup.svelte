<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let id = undefined;
  export let size = '';
  export let vertical = false;

  $: classes = classnames(
    className,
    size ? `btn-group-${size}` : false,
    vertical ? 'btn-group-vertical' : 'btn-group'
  );
</script>

<div {...$$restProps} {id} class={classes}>
  <slot />
</div>
