<script>
  import classnames from './utils';

  let className = '';
  export { className as class };

  $: classes = classnames(className, 'card-subtitle');
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
