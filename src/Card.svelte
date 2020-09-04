<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let body = false;
  export let color = '';
  export let inverse = false;
  export let outline = false;
  export let style = '';

  $: classes = classnames(
    className,
    'card',
    inverse ? 'text-white' : false,
    body ? 'card-body' : false,
    color ? `${outline ? 'border' : 'bg'}-${color}` : false
  );
</script>

<div {...$$restProps} class={classes} on:click {style}>
  <slot />
</div>
