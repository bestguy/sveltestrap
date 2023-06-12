<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let inline = false;
  export let color = undefined;

  $: classes = classnames(
    className,
    !inline ? 'form-text' : false,
    color ? `text-${color}` : false
  );
</script>

<small {...$$restProps} class={classes}>
  <slot />
</small>
