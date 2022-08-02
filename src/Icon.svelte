<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let name = '';

  $: classes = classnames(className, `bi-${name}`);
</script>

<i {...$$restProps} class={classes} />
