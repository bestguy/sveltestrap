<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let flush = false;

  $: classes = classnames(
    className,
    'list-group',
    flush ? 'list-group-flush' : false
  );
</script>

<ul {...$$restProps} class={classes}>
  <slot />
</ul>
