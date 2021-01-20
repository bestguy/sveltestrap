<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let name = '';

  $: classes = classnames(className, `bi-${name}`);
</script>

<style>
  @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css');
</style>

<i {...$$restProps} class={classes} />
