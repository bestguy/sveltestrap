<script>
  import classnames from './utils';

  let className = '';
  export { className as class };
  export let body = false;
  export let color = '';
  export let inverse = false;
  export let outline = false;

  $: classes = classnames(
    className,
    'card',
    inverse ? 'text-white' : false,
    body ? 'card-body' : false,
    color ? `${outline ? 'border' : 'bg'}-${color}` : false
  );
</script>

<div {...$$restProps} class={classes} on:click>
  <slot />
</div>
