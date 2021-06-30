<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let alt = undefined;
  export let fluid = false;
  export let thumbnail = false;

  $: classes = classnames(
    className,
    {
      'img-fluid': fluid,
      'img-thumbnail': thumbnail
    }
  );
</script>

<img {alt} {...$$restProps} class={classes} />
