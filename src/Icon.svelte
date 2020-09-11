<script lang="ts">
  import classnames from './utils';
  export let name = undefined;
  export let size = '1rem';
  export let color = undefined;
  export let url = 'https://cdn.jsdelivr.net/gh/twbs/icons/bootstrap-icons.svg';
  let className = undefined;
  export { className as class };

  $: classes = classnames(
    'bi',
    color ? `text-${color}` : false,
    className
  );
</script>

<svg
  class={classes}
  style={`width:${size}; height:${size}`}
  fill="currentColor"
  {...$$restProps}>
  <use xlink:href={`${url}#${name}`} />
</svg>
