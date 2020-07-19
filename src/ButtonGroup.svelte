<script lang="typescript">
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let id = '';
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
