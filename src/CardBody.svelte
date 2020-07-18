<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let id = '';


  $: classes = classnames(className, 'card-body');
</script>

<div {...$$restProps} {id} class={classes}>
  <slot />
</div>
