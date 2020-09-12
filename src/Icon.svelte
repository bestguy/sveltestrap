<script lang="ts">
  import classnames from './utils';
  export let name = undefined;
  export let size = '1rem';
  export let color = undefined;
  export let url = 'https://cdn.jsdelivr.net/gh/twbs/icons/icons/';
  let className = undefined;
  export { className as class };

  $: classes = classnames(
    'bi',
    color ? `text-${color}` : false,
    className
  );
</script>

<img
  alt={name}
  class={classes}
  src={`${url}${name}.svg`}
  style={`width:${size}; height:${size}`}
  {...$$restProps}
/>
