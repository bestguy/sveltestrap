<script>
  import classnames from './utils';

  let className = '';
  export { className as class };

  $: classes = classnames(className, 'card-deck');
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
