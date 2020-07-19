<script lang="typescript">
  import classnames from './utils';

  let className = '';
  export { className as class };

  $: classes = classnames(className, 'modal-body');
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
